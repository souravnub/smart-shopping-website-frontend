import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { CgMenuGridR, CgClose } from "react-icons/cg";
import Links from "../../pages/Admin page/SideBarLink";
import { useGlobalContext } from "../../context";

const AdminSidebar = () => {
    const { user } = useGlobalContext();

    const location = useLocation();
    let currentLink = location.pathname.split("/")[2];
    const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

    return (
        <>
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
                            backgroundImage: `url(${user.user_img})`,
                        }}></div>

                    <span>{user.user}</span>
                </div>

                <div className="admin-options-container main-side-bar-options-container">
                    {Links.map((link, idx) => {
                        return (
                            <Link
                                to={`/adminPage/${link.text}`}
                                className={`admin-link ${
                                    link.text === currentLink ? "active" : ""
                                }`}
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
                    {Links.slice(0, 6).map((link, idx) => {
                        return (
                            <Link
                                to={`/adminPage/${link.text}`}
                                className={`admin-link ${
                                    link.text === currentLink ? "active" : ""
                                }`}
                                key={idx}>
                                {link.icon}
                                <span>{link.text}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
