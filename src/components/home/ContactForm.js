import React, { useState, useRef } from "react";
import { useGlobalContext } from "../../context";
import { FaTelegramPlane } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import Spinner from "../Spinner";

const ContactForm = () => {
    const { dispatchAlert, newsLetterHolder } = useGlobalContext();

    const [newsLetterLoading, setNewsLetterLoading] = useState(false);
    const [joinedNewsLetter, setJoinedNewsLetter] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const emailRef = useRef();
    const nameRef = useRef();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (message.length > 20) {
            setMessageLoading(true);
            const response = await fetch(
                "http://localhost:5000/api/messages/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: name,
                        email: email,
                        message: message,
                    }),
                }
            );
            const json = await response.json();
            setMessageLoading(false);

            if (json.success) {
                return dispatchAlert("success", json.message);
            }
            return dispatchAlert("error", json.message);
        } else {
            dispatchAlert(
                "error",
                "message should be more than 20 characters."
            );
        }
    };

    const handleMailServiceClick = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `http://localhost:5000/newsletter/addremove?name=${nameRef.current.value}&email=${emailRef.current.value}&action=add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const json = await response.json();

        if (json.success) {
            setJoinedNewsLetter(true);
            return dispatchAlert("success", json.message);
        }

        return dispatchAlert("error", json.message);
    };

    return (
        <div className="contact-section">
            <div className="contact-form-container">
                <span>drop us a line !</span>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="name">name</label>
                    </div>

                    <div>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">email</label>
                    </div>

                    <div>
                        <textarea
                            required
                            cols="30"
                            rows="10"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder=" "></textarea>
                        <label htmlFor="message">message</label>
                    </div>

                    {!messageLoading ? (
                        <button className="border-btn" type="submit">
                            send
                        </button>
                    ) : (
                        <Spinner size=".8rem" />
                    )}
                </form>
            </div>

            <p className="info">
                This site is protected by reCAPTCHA and the Google{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://policies.google.com/privacy"
                    className="link">
                    Privacy Policy
                </a>{" "}
                and{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://policies.google.com/terms"
                    className="link">
                    Terms of Service
                </a>{" "}
                apply.
            </p>

            <div className="bottom-info">
                <span>questions or concerns?</span>
                <span>
                    Need help selecting a product or finding a compatible
                    option? Send us a message!
                </span>

                <div className="buisness-info">
                    <span>S-Mart</span>
                    <span>3111 Fake Street, Anytown, AZ 12121</span>
                    <span>email@gmail.com</span>
                </div>
            </div>

            {!newsLetterHolder &&
                (!joinedNewsLetter ? (
                    <div className="main-newsletter-container">
                        <div
                            className={`newsletter-container ${
                                joinedNewsLetter &&
                                "hidden-newsletter-container"
                            }`}>
                            <div className="head">
                                <div className="heading">
                                    <FaTelegramPlane />
                                    <span>newsletter</span>
                                </div>

                                <div className="newsletter-info">
                                    Are you too a frequent buyer? SignUp and you
                                    will also receive Information about the
                                    latest products launched every week.
                                </div>
                            </div>

                            <form onSubmit={handleMailServiceClick}>
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder=" "
                                        ref={nameRef}
                                    />
                                    <label htmlFor="name">name</label>
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder=" "
                                        ref={emailRef}
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>

                                <button type="submit">JOIN NOW !</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="joined-newsletter-container">
                        <IoCheckmarkDoneOutline className="icon" />
                        <span>
                            You have successfully been added to mail service !!
                        </span>
                        <span>Updates will be sent to your email.</span>
                    </div>
                ))}
        </div>
    );
};

export default ContactForm;
