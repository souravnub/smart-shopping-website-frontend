import React from "react";
import { BsArrowRight, BsCashCoin } from "react-icons/bs";
import { SiLamborghini } from "react-icons/si";
import { AiFillWechat, AiFillApple } from "react-icons/ai";
import { DiGoogleAnalytics, DiLinux, DiHtml5 } from "react-icons/di";
import { FaGlobeAsia } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="about-container">
            <div className="about-hero">
                <span>S MART - FINEST ONLINE SHOPPING FIRM </span>
                <h2>masters for dealing with online shopping</h2>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Illo voluptatum laborum quas? Tempora perspiciatis accusamus
                    iusto sapiente beatae mollitia voluptates consectetur
                    quibusdam non laboriosam, ad eligendi soluta asperiores
                    pariatur assumenda!
                </p>
            </div>

            <div className="about-cards-container">
                <div className="card">
                    <div className="illustration">
                        <DiGoogleAnalytics />
                    </div>

                    <h1>real time product status analysis</h1>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Eaque, dolore!
                    </p>

                    <button>
                        <span>learn more</span>
                        <BsArrowRight className="arrow" />
                    </button>
                </div>

                <div className="card">
                    <div className="illustration">
                        <AiFillWechat />
                    </div>

                    <h1>24/7 customer service</h1>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Eaque, dolore!
                    </p>

                    <button>
                        <span>learn more</span>
                        <BsArrowRight className="arrow" />
                    </button>
                </div>

                <div className="card">
                    <div className="illustration">
                        <FaGlobeAsia />
                    </div>

                    <h1>delivery service around the globe</h1>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Eaque, dolore!
                    </p>

                    <button>
                        <span>learn more</span>
                        <BsArrowRight className="arrow" />
                    </button>
                </div>

                <div className="card">
                    <div className="illustration">
                        <BsCashCoin />
                    </div>

                    <h1>secure and genuine transactions</h1>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Eaque, dolore!
                    </p>

                    <button>
                        <span>learn more</span>
                        <BsArrowRight className="arrow" />
                    </button>
                </div>
            </div>

            <div className="sponsors-section">
                <span>Our sponsors</span>

                <div className="sponsors-container">
                    <AiFillApple />
                    <DiLinux />
                    <DiHtml5 />
                    <SiLamborghini />
                </div>
            </div>

            <div className="info-container">
                <span>give us a chance to serve you as well !!</span>

                <Link to="/products" className="btn">
                    shop now
                </Link>
            </div>
        </div>
    );
};

export default About;
