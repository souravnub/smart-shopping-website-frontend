import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import { Link } from "react-router-dom";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import Spinner from "../Spinner";
import { MdOutlineLocalShipping, MdOpenWith } from "react-icons/md";
import {
    BsExclamationCircle,
    BsCheckCircle,
    BsClockHistory,
} from "react-icons/bs";
import "../OrderInfoModal/orderInfoModal.css";

const OrdersDetails = () => {
    const { genDate } = useGlobalContext();
    const [orders, setOrders] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch("http://localhost:5000/orders/allorders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("ShopAuthtoken"),
            },
        });

        const json = await response.json();

        let main_l = [];

        json.forEach((order) => {
            let ordersarr = order.orders;

            ordersarr.forEach((order_obj) => {
                const { name, price, quantity } = order_obj;

                let order_ele = {
                    name,
                    price: `$${price}`,
                    quantity,
                    status: order_obj.order_status,
                    "ordered at": genDate(order.createdAt),
                    "Sub Total": ` $${order_obj.price * order_obj.quantity}`,
                };
                main_l.push(order_ele);
            });
        });
        if (main_l.length !== 0) {
            setOrders(main_l);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (orders.length !== 0) {
            const headers_arr = ["S No."].concat(
                Object.keys(orders[0]).filter((header) => {
                    return header !== "_id";
                })
            );
            setHeaders(headers_arr);
        }
    }, [orders]);

    useEffect(() => {
        fetchData();
    }, []);

    return loading ? (
        <Spinner size="1.8rem" text="fetching data...." fontSize=".9rem" />
    ) : orders.length !== 0 ? (
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
                    const values = [`${idx + 1}.`].concat(Object.values(order));
                    return (
                        <tr key={idx}>
                            {values.map((value, idx) => {
                                return (
                                    <td key={idx}>
                                        {value === "pending" ? (
                                            <div
                                                className="value-container"
                                                style={{
                                                    "--fill-color": "#5e5eff",
                                                }}>
                                                <BsClockHistory />
                                                Pending
                                            </div>
                                        ) : value === "declined" ? (
                                            <div
                                                className="value-container"
                                                style={{
                                                    "--fill-color": "#f36741",
                                                }}>
                                                <BsExclamationCircle />
                                                declined
                                            </div>
                                        ) : value === "shipped" ? (
                                            <div
                                                className="value-container"
                                                style={{
                                                    "--fill-color": "#327532",
                                                }}>
                                                <MdOutlineLocalShipping />
                                                Shipped
                                            </div>
                                        ) : value === "delivered" ? (
                                            <div
                                                className="value-container"
                                                style={{
                                                    "--fill-color": "#00ad00",
                                                }}>
                                                <BsCheckCircle />
                                                Delivered
                                            </div>
                                        ) : value === "dispatched" ? (
                                            <div
                                                className="value-container"
                                                style={{
                                                    "--fill-color": "#c0a01d",
                                                }}>
                                                <MdOpenWith />
                                                Dispatched
                                            </div>
                                        ) : (
                                            value
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    ) : (
        <div
            className="no-orders-container"
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                textTransform: "capitalize",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
            }}>
            <h1
                style={{
                    fontWeight: "normal",
                    fontSize: "2.4rem",
                    textAlign: "center",
                }}>
                no ordered products yet!!
            </h1>
            <Link
                to="/products"
                className="blue-link shop-blue-link"
                style={{ fontSize: "1rem" }}>
                <MdArrowRight
                    style={{
                        fontSize: "2rem",
                        fill: "var(--logo-blob)",
                    }}
                />
                Shop Now !
                <MdArrowLeft
                    style={{
                        fontSize: "2rem",
                        fill: "var(--logo-blob)",
                    }}
                />
            </Link>
        </div>
    );
};

export default OrdersDetails;
