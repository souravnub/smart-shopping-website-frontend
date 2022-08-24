import React, { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import { FaReplyAll, FaShoppingBag, FaUsers, FaTrash } from "react-icons/fa";
import { IoIosCart, IoMdArrowDropdown } from "react-icons/io";
import { MdQuestionAnswer } from "react-icons/md";
import {
    IoChatboxEllipsesSharp,
    IoSettingsSharp,
    IoEyeSharp,
} from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../../context";
import PageNotFound from "../../../PageNotFound/PageNotFound";

import Chart from "chart.js/auto";
import LineChart from "../../../../components/charts/LineChart";

const Dashboard = () => {
    const {
        dispatchAlert,
        auth,
        genDate,
        isAdmin,
        setReplyMessageModal,
        repliedaMessage,
        setProgress,
    } = useGlobalContext();

    const [progressValue, setProgressValue] = useState(0);
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [newsLetterUsers, setNewsLetterUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    async function getAdminDashboardData() {
        setProgress(30);
        const response = await fetch(
            "https://smart-shopping-website.herokuapp.com/admin/data",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setProgress(100);
        if (json.success) {
            setMessages(json.messages);
            setProducts(json.products);
            setOrders(json.orders);
            setUsers(json.users);
            setMostSoldProducts(json.mostSoldProducts);
            setNewsLetterUsers(json.newsLetterUsers);

            let responded = 0;

            json.messages.forEach((message) => {
                if (message.responded) {
                    responded += 1;
                }
            });

            // setting the percentage of messages responded
            if (responded !== 0) {
                let i = "";
                let percentage = ((responded / json.messages.length) * 100)
                    .toString()
                    .split(".");
                if (percentage[1]) {
                    i = i + percentage[0] + "." + percentage[1].slice(0, 2);
                } else {
                    i = i + percentage[0];
                }
                setProgressValue(i);
            } else {
                setProgressValue(0);
            }
        } else {
            dispatchAlert("error", json.message);
        }
    }

    async function handleMessageDelete(id) {
        setProgress(10);
        const response = await fetch(
            `https://smart-shopping-website.herokuapp.com/messages/delete/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        setProgress(30);
        const json = await response.json();
        setProgress(100);
        if (json.success) {
            getAdminDashboardData();
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    }

    useEffect(() => {
        getAdminDashboardData();
    }, []);

    useEffect(() => {
        getAdminDashboardData();
    }, [repliedaMessage]);

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <>
            <div className="main-dashboard-container">
                <div className="cards-container">
                    <div className="card">
                        <div className="icon">
                            <FaShoppingBag
                                style={{ "--fill-color": "#00a100" }}
                            />
                        </div>
                        <div className="card-head">total products</div>

                        <div className="info">{products.length}</div>

                        <div className="sep"></div>

                        <Link
                            className="action"
                            to="/adminPage/addproduct"
                            style={{ "--fill-color": "#00d400" }}>
                            <AiOutlinePlus className="plus-icon" />
                            <span>add new product</span>
                        </Link>
                    </div>

                    <div className="card">
                        <div className="icon">
                            <FaUsers style={{ "--fill-color": "#969dff" }} />
                        </div>
                        <div className="card-head">total users</div>

                        <div className="info">{users.length}</div>

                        <div className="sep"></div>

                        <Link
                            className="action"
                            to="/adminPage/users"
                            style={{ "--fill-color": "#969dff" }}>
                            <IoSettingsSharp className="plus-icon" />
                            <span>edit users</span>
                        </Link>
                    </div>

                    <div className="card">
                        <div className="icon">
                            <IoIosCart style={{ "--fill-color": "#31cc98" }} />
                        </div>
                        <div className="card-head">total orders</div>

                        <div className="info">{orders.length}</div>

                        <div className="sep"></div>

                        <Link
                            className="action"
                            to="/adminPage/orders"
                            style={{ "--fill-color": "#31cc98" }}>
                            <IoEyeSharp className="plus-icon" />{" "}
                            <span>view orders</span>
                        </Link>
                    </div>

                    <div className="card">
                        <div className="icon">
                            <IoChatboxEllipsesSharp
                                style={{ "--fill-color": "#f4704c" }}
                            />
                        </div>
                        <div className="card-head">messages</div>

                        <div className="info">{messages.length}</div>

                        <div className="sep"></div>

                        <span className="progress-bar-container">
                            <div
                                className="progress-count"
                                style={{
                                    fontSize: ".8rem",
                                    top: `-1.16rem`,
                                    left: `${progressValue}%`,
                                }}>
                                {progressValue}%
                            </div>
                            <progress
                                max={100}
                                value={progressValue}></progress>
                            <span>
                                <span>response rate</span>{" "}
                                <Link to="/adminPage/messages">
                                    <MdQuestionAnswer />
                                </Link>
                            </span>
                        </span>
                    </div>
                </div>

                <div className="graph-container">
                    <LineChart />
                </div>

                <div className="top-selling-products-container">
                    <div className="head">
                        top selling products <IoMdArrowDropdown />
                    </div>

                    <div className="top-selling-products-container">
                        {mostSoldProducts.slice(0, 5).map((product) => {
                            return (
                                <div className="card" key={product._id}>
                                    <div
                                        className="product-image"
                                        style={{
                                            backgroundImage: `url(${product.image_url})`,
                                        }}></div>
                                    <span className="name">{product.name}</span>
                                    <span className="price">
                                        ${product.price}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="main-messages-container">
                    <div className="heading">
                        recent messages <IoMdArrowDropdown />
                    </div>

                    <div className="messages-container">
                        {messages.filter(
                            (message) => message.responded === false
                        ).length > 0 ? (
                            messages
                                .filter(
                                    (message) => message.responded === false
                                )
                                .map((message) => {
                                    const {
                                        user,
                                        createdAt,
                                        message: user_message,
                                        email,
                                        _id,
                                    } = message;
                                    return (
                                        <div className="message-card" key={_id}>
                                            <div className="head">
                                                <span className="name">
                                                    {user}
                                                </span>
                                                <span className="date">
                                                    {genDate(createdAt)}
                                                </span>
                                            </div>
                                            <span className="email">
                                                {email}
                                            </span>
                                            <p className="message">
                                                {user_message}
                                            </p>
                                            <div className="actions">
                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        handleMessageDelete(_id)
                                                    }>
                                                    <span>delete</span>
                                                    <FaTrash
                                                        className="icon"
                                                        style={{
                                                            "--fill-color":
                                                                "#ff5757",
                                                        }}
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setReplyMessageModal(
                                                            (prev) => {
                                                                return {
                                                                    message_info:
                                                                        {
                                                                            _id,
                                                                            user,
                                                                            email,
                                                                            createdAt,
                                                                            user_message,
                                                                        },
                                                                    show: true,
                                                                };
                                                            }
                                                        )
                                                    }
                                                    className="btn">
                                                    <span>reply</span>
                                                    <FaReplyAll
                                                        className="icon"
                                                        style={{
                                                            "--fill-color":
                                                                "#00a100",
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <span className="no-messages">
                                no pending messages to reply !
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
