import React, { useState, useEffect } from "react";
import { links } from "./data";

import { FaGrinHearts } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { IoIosCart } from "react-icons/io";
import { user_options } from "./data";
import { useGlobalContext } from "../../context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import { SiShopify } from "react-icons/si";
import { RiMoonClearFill } from "react-icons/ri";
import { BsFillSunFill } from "react-icons/bs";

const Navbar = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        setIsHammenuOpen,
        theme,
        setTheme,
        dispatchAlert,
        darkTheme,
        lightTheme,
        itemCount,
        auth,
        setAuth,
        isAdmin,
    } = useGlobalContext();

    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const currentLocation = useLocation();

    useEffect(() => {
        setIsHammenuOpen(false);
        setUserOpen(false);
    }, [currentLocation]);

    window.onscroll = () => {
        if (window.scrollY > 32) {
            setIsScrolledDown(true);
        } else {
            setIsScrolledDown(false);
        }
    };

    const root = document.querySelector(":root");

    const handleThemeToggle = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem("theme", "dark");

            for (let key in darkTheme) {
                root.style.setProperty(key, darkTheme[key]);
            }

            return dispatchAlert("success", "theme changed to DARK");
        }
        setTheme("light");
        localStorage.setItem("theme", "light");
        for (let key in lightTheme) {
            root.style.setProperty(key, lightTheme[key]);
        }
        return dispatchAlert("success", "theme changed to LIGHT");
    };

    const handleLogout = () => {
        localStorage.removeItem("ShopAuthtoken");
        localStorage.removeItem("admin");
        navigate("/");
        setAuth(null);
        dispatchAlert("success", "logged out successfully.");
        setUserOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentLocation]);

    return (
        <nav
            style={
                isScrolledDown
                    ? {
                          backgroundColor: "var(--bg-color)",
                          position: "fixed",
                          top: "0",
                          zIndex: 999,
                          insetInline: "0",
                          padding: `${
                              window.innerWidth <= 530 ? "1rem" : "1rem 4rem"
                          }`,
                          boxShadow: "0 0 10px 1px var(--shadow)",
                      }
                    : {}
            }>
            <RiBarChartHorizontalLine
                className="hammenu"
                onClick={() => {
                    setIsHammenuOpen(true);
                }}
            />
            <SiShopify className="logo" />
            <div className="links-container">
                {links.map((link) => {
                    const { text, url, id } = link;
                    return (
                        <Link
                            key={id}
                            to={url}
                            className={`${
                                url === currentLocation.pathname ? "active" : ""
                            } 
                            `}>
                            {text[0].toUpperCase() +
                                text.substring(1, text.length)}
                        </Link>
                    );
                })}
            </div>
            <div className="interactions-container">
                <button className="interaction" onClick={handleThemeToggle}>
                    {theme === "light" ? (
                        <BsFillSunFill />
                    ) : (
                        <RiMoonClearFill />
                    )}
                </button>

                <Link
                    to="/likedProducts"
                    className="interaction"
                    onClick={() => {
                        setSearchOpen(!searchOpen);
                        setIsCartOpen(false);
                        setUserOpen(false);
                    }}>
                    <FaGrinHearts />
                </Link>
                <button
                    className="interaction cart-btn"
                    onClick={() => {
                        setIsCartOpen(!isCartOpen);
                        setSearchOpen(false);
                        setUserOpen(false);
                    }}>
                    <IoIosCart />
                    <span className="cart-count">{itemCount}</span>
                </button>

                {auth ? (
                    <button
                        className="interaction"
                        onClick={() => {
                            setUserOpen(!userOpen);
                            setIsCartOpen(false);
                            setSearchOpen(false);
                        }}>
                        <AiOutlineUser />
                    </button>
                ) : (
                    <Link className="login-btn" to="/login">
                        Login
                    </Link>
                )}
            </div>

            <div
                className={`user-info-container ${
                    userOpen === true ? "user-info-container-show" : ""
                }`}>
                {!isAdmin ? (
                    user_options.map((option, index) => {
                        const { url, text } = option;
                        return (
                            <Link to={url} key={index} className="user_links">
                                {text}
                            </Link>
                        );
                    })
                ) : (
                    <>
                        <Link to="/adminPage" className="user_links">
                            Admin Page
                        </Link>

                        {user_options.map((option, index) => {
                            const { url, text } = option;
                            return (
                                <Link
                                    to={url}
                                    key={index}
                                    className="user_links">
                                    {text}
                                </Link>
                            );
                        })}
                    </>
                )}

                <button
                    tabIndex={0}
                    className="user_links"
                    onClick={handleLogout}
                    style={{ cursor: "pointer", textAlign: "left" }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
