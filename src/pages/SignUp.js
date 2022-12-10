import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { MdArrowRight, MdEdit } from "react-icons/md";
import pincodes from "../data/Pincodes";
import Spinner from "../components/Spinner";

const SignIn = () => {
    const { dispatchAlert, auth, setAuth } = useGlobalContext();
    let navigate = useNavigate();
    const ImgInpRef = useRef();

    const [loading, setLoading] = useState(false);

    const [userImg, setUserImg] = useState(
        "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
    );
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [phone, setPhone] = useState("");

    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [passwd, setPasswd] = useState("");
    const [confirm, setConfirm] = useState("");

    useEffect(() => {
        // if user is logged in then push him to home
        if (auth) {
            navigate("/");
        }
    }, []);

    const handleImgInpChange = () => {
        const file = ImgInpRef.current.files[0];

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                setUserImg(reader.result);
            });
            reader.readAsDataURL(file);
        } else {
            setUserImg(
                "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwd === confirm) {
            if (passwd.length < 6) {
                return dispatchAlert(
                    "error",
                    "password length must be more than 6 charcters.."
                );
            }
            if (user.length < 3) {
                return dispatchAlert(
                    "error",
                    "user name must be more than 3 characters."
                );
            }
            if (phone.length !== 10) {
                return dispatchAlert("error", "Invalid phone number.");
            } else {
                setLoading(true);

                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user: user,
                            user_img: userImg,
                            email: email,
                            password: passwd,
                            phone: phone,

                            location_info: {
                                state: state,
                                city: city,
                                address: address,
                                pincode: pinCode,
                            },
                        }),
                    }
                );
                const json = await response.json();

                setLoading(false);

                if (json.success) {
                    localStorage.setItem("ShopAuthtoken", json.authtoken);
                    setAuth(json.authtoken);
                    navigate("/");
                    dispatchAlert("success", "signed up successfully.");
                } else {
                    dispatchAlert("error", json.message);
                }
            }
        } else {
            dispatchAlert("error", "passwords don't match... ");
        }
    };
    return (
        <div className="contact-form-container sign-in-form-container">
            <span className="abs-info">
                <MdArrowRight />
                all your details are in a safe hand ... feel free to share your
                information
            </span>
            <span>SIGN UP !</span>
            <form onSubmit={handleSubmit}>
                <span
                    className="user_img"
                    style={{
                        display: "block",
                        backgroundImage: `url(${userImg})`,
                        borderRadius: "50%",
                        width: "8rem",
                        aspectRatio: "1",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        marginInline: "auto",
                        position: "relative",
                    }}>
                    <input
                        type="file"
                        ref={ImgInpRef}
                        accept="image/*"
                        onChange={handleImgInpChange}
                        style={{ display: "none" }}
                    />
                    <button
                        type="button"
                        onClick={() => ImgInpRef.current.click()}>
                        <MdEdit style={{ fill: "white" }} />
                    </button>
                </span>

                <div>
                    <input
                        type="text"
                        placeholder=" "
                        required
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <label htmlFor="name">name</label>
                </div>
                <div>
                    <input
                        type="number"
                        placeholder=" "
                        required
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                    <label htmlFor="name">phone</label>
                </div>

                <div>
                    <input
                        type="email"
                        required
                        placeholder=" "
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
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

                <div>
                    <input
                        type="password"
                        placeholder=" "
                        required
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value);
                        }}
                    />
                    <label htmlFor="message">confirm passoword</label>
                </div>

                <h3
                    style={{
                        marginTop: "6rem",
                        fontSize: "2.3rem",
                        fontWeight: 300,
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.5,
                    }}>
                    Location Info <MdArrowRight />
                </h3>

                <div>
                    <input
                        type="text"
                        placeholder=" "
                        required
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                    />
                    <label htmlFor="name">state</label>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder=" "
                        required
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                    />
                    <label htmlFor="name">city</label>
                </div>

                <div>
                    <textarea
                        cols={30}
                        rows={5}
                        type="text"
                        placeholder=" "
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                    />
                    <label htmlFor="name">address</label>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder=" "
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                    />
                    <label htmlFor="name">pincode</label>
                    <span
                        className="pincode-check"
                        style={
                            pincodes.includes(pinCode)
                                ? { color: "#00a100" }
                                : { color: "#ff6b6b" }
                        }>
                        {pincodes.includes(pinCode)
                            ? "* pincode available for service"
                            : "* pincode not available for service."}
                    </span>
                </div>

                {loading ? (
                    <Spinner
                        textSize=".8rem"
                        size="1.5rem"
                        text="signing you in !"
                    />
                ) : (
                    <button
                        className="border-btn"
                        type="submit"
                        style={{ whiteSpace: "nowrap", marginTop: "8rem" }}>
                        sign up
                    </button>
                )}

                <span className="login-option">
                    already having an account <MdArrowRight />
                    <Link to="/login">Login In</Link>
                </span>
            </form>
        </div>
    );
};

export default SignIn;
