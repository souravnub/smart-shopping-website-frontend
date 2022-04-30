import React from "react";
import { FaArrowDown } from "react-icons/fa";

const hero = () => {
    return (
        <>
            <div className="hero-container" id="home">
                <div className="img-section">
                    <img
                        src="https://img1.wsimg.com/isteam/ip/7fc6e18a-828b-4048-abe3-8dd7aad63ecd/pexels-thorn-yang-168765-0001.jpg/:/rs=w:2320"
                        alt="hero"
                    />
                </div>

                <div className="hero-info">
                    <div className="notch"></div>
                    <div className="info">
                        <h1>CUTTING EDGE</h1>
                        <p>
                            Now taking online orders. Order today and get 15%
                            off your first order. Hurry while supplies last!
                        </p>
                        <a href="#products" className="border-btn">
                            <span>shop</span>
                            <FaArrowDown className="arrow" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default hero;
