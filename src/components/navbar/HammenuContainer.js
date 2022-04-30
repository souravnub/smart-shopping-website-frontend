import React from "react";
import { links } from "./data";
import { Link, useLocation } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import { useGlobalContext } from "../../context";

const HammenuContainer = () => {
    const currentLocation = useLocation();
    const { setIsHammenuOpen, isHammenuOpen } = useGlobalContext();

    return (
        <div
            className="hammenu-main-container"
            style={{
                transform: isHammenuOpen
                    ? "translateX(0)"
                    : "translateX(-150vw)",
            }}>
            <GrClose
                className="hammenu-close-btn"
                onClick={() => {
                    setIsHammenuOpen(false);
                }}
            />

            <div className="hammenu-links-container">
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
        </div>
    );
};

export default HammenuContainer;
