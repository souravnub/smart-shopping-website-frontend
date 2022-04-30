const express = require("express");
const Orders = require("../models/Orders");
const Products = require("../models/Products");
const Users = require("../models/Users");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

// adding an order for a user
router.post("/addorder", async (req, res) => {
    try {
        try {
            req.body.orders.forEach(async (product) => {
                let product_to_update = await Products.findById(
                    product.product_id
                );

                product_to_update.available_quantity =
                    product_to_update.available_quantity - product.quantity;

                const available_quantity = product_to_update.available_quantity;

                if (product_to_update.available_quantity === 0) {
                    await Products.findByIdAndUpdate(product.product_id, {
                        available_quantity: available_quantity,
                        in_stock: false,
                    });
                } else {
                    await Products.findByIdAndUpdate(
                        product.product_id,
                        product_to_update
                    );
                }
            });

            await Orders.create(req.body)
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "order received successfully.",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Order was not placed.. some error occured.",
                    });
                });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "some internal server error ",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// getting all orders corresponding to a user
router.get("/allorders", async (req, res) => {
    try {
        let userId = null;

        try {
            const data = jwt.verify(
                req.headers.token,
                process.env.JWT_SECRET_KEY
            );
            userId = data.userId;
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "invalid authtoken.",
            });
        }

        try {
            const user = await Users.findById(userId).select("email");

            const orders = await Orders.find({
                user_email: user.email,
            }).select("orders createdAt order_status");

            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "some internal server error occured..",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// getting all the orders in the shop
router.get("/allshoporders", async (req, res) => {
    try {
        const orders = await Orders.find({});
        const userData = jwt.verify(
            req.headers.token,
            process.env.JWT_SECRET_KEY
        );

        const user = await Users.findOne({ _id: userData.userId }).select(
            "is_admin"
        );

        if (user.is_admin) {
            res.status(200).json({ success: true, orders });
        } else {
            res.status(401).json({
                success: false,
                message: "unauthorized access are not allowed!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            sucess: false,
            message: "some internal server error occured.",
        });
    }
});

module.exports = router;
