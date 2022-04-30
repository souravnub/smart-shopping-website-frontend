import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useGlobalContext } from "../../context";
import { Link } from "react-router-dom";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import Spinner from "../Spinner";

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
                    "ordered at": genDate(order.createdAt),
                    Status: order.order_status,
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
                                return <td key={idx}>{value}</td>;
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
