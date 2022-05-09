import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowRight } from "react-icons/md";
import { useGlobalContext } from "../context";
import Spinner from "../components/Spinner";

const CreateAccount = () => {
    const navigate = useNavigate();
    const { setAuth, dispatchAlert, auth } = useGlobalContext();

    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // if user is logged in then push him to home
        if (auth) {
            navigate("/");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await fetch(
            "https://smart-shopping-website.herokuapp.com/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: passwd,
                }),
            }
        );

        const json = await response.json();

        setLoading(false);

        if (json.success) {
            setAuth(json.authtoken);
            localStorage.setItem("ShopAuthtoken", json.authtoken);
            navigate("/");
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    };
    return (
        <div className="contact-form-container sign-in-form-container">
            <span>LOG IN !</span>
            <form onSubmit={handleSubmit}>
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
                    <input
                        type="password"
                        placeholder=" "
                        required
                        value={passwd}
                        onChange={(e) => {
                            setPasswd(e.target.value);
                        }}
                    />
                    <label htmlFor="message">password</label>
                </div>

                {!loading ? (
                    <button
                        className="border-btn"
                        type="submit"
                        style={{ whiteSpace: "nowrap" }}>
                        Login
                    </button>
                ) : (
                    <Spinner text="logging you in!" fontSize=".7rem" />
                )}

                <div className="options-container">
                    <span className="login-option">
                        don't have an account <MdArrowRight className="icon" />
                        <Link to="/signup">sign up</Link>
                    </span>
                    <span className="login-option">
                        forgot passoword <MdArrowRight className="icon" />
                        <Link to="/forgotpassword">forgot password</Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default CreateAccount;
