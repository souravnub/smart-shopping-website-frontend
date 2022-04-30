import React, { useState, useEffect } from "react";
import Spinner from "../../../components/Spinner";
import { useGlobalContext } from "../../../context";

const headers = [
    "S No.",
    "ordered by",
    "product",
    "unit price",
    "quantity",
    "ordered on",
    "status",
    "sub total",
];
const OrdersPage = () => {
    const { auth, dispatchAlert, genDate } = useGlobalContext();

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        setLoading(true);
        const response = await fetch(
            "http://localhost:5000/orders/allshoporders",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setLoading(false);

        if (json.success) {
            let main_l = [];

            json.orders.forEach((order) => {
                let ordersarr = order.orders;
                const user_email = order.buyer_info.email;

                ordersarr.forEach((order_obj) => {
                    const { name, price, quantity } = order_obj;

                    let order_ele = {
                        user_email,
                        name,
                        price: `$${price}`,
                        quantity,
                        "ordered at": genDate(order.createdAt),
                        Status: order.order_status,
                        "Sub Total": ` $${
                            order_obj.price * order_obj.quantity
                        }`,
                    };
                    main_l.push(order_ele);
                });
            });
            if (main_l.length !== 0) {
                setOrders(main_l);
            }
        } else {
            dispatchAlert("error", json.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Spinner text="fetching orders..." size="2rem" fontSize=".8rem" />
        );
    }

    return (
        <div style={{ overflowX: "auto", maxWidth: "80vw" }}>
            <table className="content-table">
                <thead>
                    <tr>
                        {headers.map((header) => {
                            return <th key={header}>{header}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, idx) => {
                        const values = [`${idx + 1}.`].concat(
                            Object.values(order)
                        );
                        return (
                            <tr key={idx}>
                                {values.map((value, idx) => {
                                    return (
                                        <td
                                            key={idx}
                                            style={{
                                                textTransform: `${
                                                    idx === 1
                                                        ? "none"
                                                        : "capitalize"
                                                }`,
                                            }}>
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;
