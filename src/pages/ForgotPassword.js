import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowRight } from "react-icons/md";
import { useGlobalContext } from "../context";

const ForgotPassword = () => {
    const { auth } = useGlobalContext();
    const navigate = useNavigate();
    const handleFormSubmit = () => {};
    const [email, setEmail] = useState("");

    useEffect(() => {
        // if user is logged in then push to home
        if (auth) {
            navigate("/");
        }
    }, []);

    return (
        <div className="contact-form-container">
            <span>Forgot Password !</span>
            <form onSubmit={handleFormSubmit}>
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

                <button className="border-btn" type="submit">
                    Proceed
                </button>

                <div className="options-container">
                    <span className="login-option">
                        don't have an account <MdArrowRight className="icon" />
                        <Link to="/signup">sign up</Link>
                    </span>
                    <span className="login-option">
                        already have an account
                        <MdArrowRight className="icon" />
                        <Link to="/login">login</Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
