import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountDetails from "../../components/account/AccountDetails";
import AddressDetails from "../../components/account/AddressDetails";
import OrdersDetails from "../../components/account/OrdersDetails";
import { useGlobalContext } from "../../context";

import links from "./account page links";

const MyAccount = () => {
    const { auth } = useGlobalContext();
    const navigate = useNavigate();

    const [activeLink, setActiveLink] = useState("details");
    const [activeContainer, setActiveContainer] = useState(<AccountDetails />);

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState({});

    const fetchUserData = async () => {
        setLoading(true);
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/getuser`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setSuccess(json.success);
        setUser(json.user);
        setLoading(false);
    };

    useEffect(() => {
        // if user is not signed in the push him to home
        if (!auth) {
            return navigate("/");
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        if (activeLink === "details") {
            return setActiveContainer(<AccountDetails user={user} />);
        } else if (activeLink === "addressBook") {
            return setActiveContainer(<AddressDetails user={user} />);
        } else if (activeLink === "orders") {
            return setActiveContainer(<OrdersDetails user={user} />);
        } else {
            return;
        }
    }, [activeLink, user]);

    return (
        <div
            className={`main-account-info-container ${
                activeLink === "orders" ? "main-orders-info-container" : ""
            }`}>
            <div className="account-nav">
                <span className="heading">my account</span>
                <ul className="account-nav-links-container">
                    {links.map((link) => {
                        return (
                            <li
                                key={link.text}
                                className={`account-nav-link ${
                                    link.active_text === activeLink
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setActiveLink(link.active_text)}>
                                {link.icon}
                                <span>{link.text}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {loading ? (
                <h1
                    style={{
                        textAlign: "center",
                        marginTop: "25vh",
                        fontWeight: "normal",
                        fontSize: "2rem",
                        textTransform: "capitalize",
                        opacity: 0.7,
                    }}>
                    Loading...
                </h1>
            ) : (
                <div
                    className={`account-info-container ${
                        activeLink === "orders" ? "content-table-container" : ""
                    }`}>
                    {success ? (
                        activeContainer
                    ) : (
                        <h1
                            style={{
                                textAlign: "center",
                                marginTop: "5rem",
                                fontWeight: "normal",
                                fontSize: "3rem",
                                textTransform: "capitalize",
                                opacity: 0.7,
                            }}>
                            user not found ! 404
                        </h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyAccount;
