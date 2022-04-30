import React, { useState } from "react";
import "./dashboard.css";
import { FaShoppingBag, FaUsers } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [progressValue, setProgressValue] = useState(54);
    return (
        <div className="main-dashboard-container">
            <div className="cards-container">
                <div className="card">
                    <div className="icon">
                        <FaShoppingBag style={{ "--fill-color": "#00a100" }} />
                    </div>
                    <div className="card-head">total products</div>

                    <div className="info">10.800</div>

                    <div className="sep"></div>

                    <Link
                        className="action"
                        to="/addproduct"
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

                    <div className="info">10</div>

                    <div className="sep"></div>

                    <span className="updation-info">
                        <MdUpdate className="update-icon" />
                        <span>Data Updated Now</span>
                    </span>
                </div>

                <div className="card">
                    <div className="icon">
                        <IoIosCart style={{ "--fill-color": "#31cc98" }} />
                    </div>
                    <div className="card-head">total sales</div>

                    <div className="info">100</div>

                    <div className="sep"></div>

                    <span className="updation-info">
                        <MdUpdate className="update-icon" />
                        <span>Data Updated Now</span>
                    </span>
                </div>

                <div className="card">
                    <div className="icon">
                        <IoChatboxEllipsesSharp
                            style={{ "--fill-color": "#f4704c" }}
                        />
                    </div>
                    <div className="card-head">new messages</div>

                    <div className="info">80</div>

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
                        <progress max={100} value={progressValue}></progress>
                        <span>respone rate</span>
                    </span>
                </div>
            </div>

            <div className="messages-container"></div>

            <div className="grap-container"></div>
        </div>
    );
};

export default Dashboard;
