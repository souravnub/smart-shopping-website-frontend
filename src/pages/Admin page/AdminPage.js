import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import PageNotFound from "../PageNotFound/PageNotFound";
import Loading from "../../components/Loading";
import "./Admin page.css";
import { CgMenuGridR, CgClose } from "react-icons/cg";
import Links from "./SideBarLink";
import OrdersPage from "./Subpages/OrdersPage";
import Dashboard from "./Subpages/dashboard/Dashboard";
import ProductsPage from "./Subpages/ProductsPage";
import MessagesPage from "./Subpages/MessagesPage";
import NewsletterPage from "./Subpages/news letter page/NewsletterPage";
import Users from "./Subpages/Users";
import { Link } from "react-router-dom";

const AdminPage = ({ adminReturn }) => {
    const { isAdmin, adminLoading } = useGlobalContext();

    const [activeLink, setActiveLink] = useState(
        adminReturn ? "products" : "dashboard"
    );
    const [res, setRes] = useState("");

    const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

    window.addEventListener("scroll", () => {
        if (isAdminSideBarOpen && window.scrollY > 25) {
            setIsAdminSideBarOpen(false);
        }
    });

    useEffect(() => {
        setIsAdminSideBarOpen(false);

        switch (activeLink) {
            case "orders":
                setRes(<OrdersPage />);
                break;

            case "dashboard":
                setRes(<Dashboard />);
                break;

            case "products":
                setRes(<ProductsPage />);
                break;

            case "messages":
                setRes(<MessagesPage />);
                break;

            case "newsletter":
                setRes(<NewsletterPage />);
                break;

            case "users":
                setRes(<Users />);
                break;
            default:
                setRes(<PageNotFound />);
        }
    }, [activeLink]);

    if (adminLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                    width: "50vw",
                    margin: "auto",
                }}>
                <Loading
                    width="10rem"
                    height="10rem"
                    lineHeight="3rem"
                    lineWidth=".1rem"
                />
                <h1 style={{ fontWeight: "normal", fontSize: "2rem" }}>
                    Fetching Data....
                </h1>
            </div>
        );
    }

    return isAdmin ? (
        <div className="main-admin-page-container">
            <div
                className={`main-admin-side-bar ${
                    isAdminSideBarOpen ? "main-side-bar-open" : ""
                }`}>
                <button
                    className="close-btn"
                    onClick={() => setIsAdminSideBarOpen(false)}>
                    <CgClose />
                </button>

                <div className="admin-profile-container">
                    <div
                        className="admin-dp"
                        style={{
                            backgroundImage: `url("https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7")`,
                        }}></div>

                    <span>robert downy junior</span>
                </div>

                <div className="admin-options-container main-side-bar-options-container">
                    {Links.map((link, idx) => {
                        return (
                            <Link
                                to={link.text}
                                className={`admin-link ${
                                    link.text === activeLink ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveLink(link.text);
                                }}
                                key={idx}>
                                {link.icon}
                                <span>{link.text}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="admin-side-bar">
                <button
                    className="admin-hammenu-btn"
                    onClick={() => setIsAdminSideBarOpen(true)}>
                    <CgMenuGridR className="hammenu-btn" />
                </button>
                <div className="admin-options-container">
                    {Links.map((link, idx) => {
                        return (
                            <button
                                className={`admin-link ${
                                    link.text === activeLink ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveLink(link.text);
                                }}
                                key={idx}>
                                {link.icon}
                                <span>{link.text}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* set some height on the data-container and then handle the overflow as that of youtube. */}
            <div className="data-container">{res}</div>
        </div>
    ) : (
        <PageNotFound />
    );
};

export default AdminPage;
