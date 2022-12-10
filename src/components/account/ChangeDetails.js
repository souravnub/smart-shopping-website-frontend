import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../../context";
import Spinner from "../Spinner";
import { MdEdit, MdArrowRight, MdMarkEmailRead } from "react-icons/md";
import { RiMailCloseFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import pincodes from "../../data/Pincodes";

const ChangeDetails = () => {
    const { dispatchAlert, auth } = useGlobalContext();
    const [isHolder, setIsHolder] = useState(false);

    // prevDetails had been created so as to keep track of the previous details of the user .... if user had not made any change in the data then we will not send the post req to the backend
    const [prevDetails, setPrevDetails] = useState({});
    const [user, setUser] = useState({
        location_info: {
            state: "",
            city: "",
            pincode: 0,
            address: "",
        },
        _id: "",
        user: "",
        user_img:
            "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        email: "",
        phone: "",
        "news letter holder": false,
    });
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    const navigate = useNavigate();
    const ImgInpRef = useRef();

    const handleImgInpChange = () => {
        const file = ImgInpRef.current.files[0];

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", function () {
                setUser((prev) => {
                    return { ...prev, user_img: reader.result };
                });
            });
            reader.readAsDataURL(file);
        } else {
            setUser((prev) => {
                return {
                    ...prev,
                    user_img:
                        "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                };
            });
        }
    };
    // getting user info
    const getUser = async () => {
        setLoading(true);
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/getuser`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setLoading(false);
        if (json.success) {
            const { _id, email, user, user_img, phone, location_info } =
                json.user;
            setIsHolder(json.user["news letter holder"]);
            setPrevDetails({
                _id,
                email,
                user,
                user_img,
                phone,
                location_info,
                "news letter holder": json.user["news letter holder"],
            });
            return setUser({
                _id,
                email,
                user,
                user_img,
                phone,
                location_info,
                "news letter holder": json.user["news letter holder"],
            });
        }
        return dispatchAlert("error", json.message);
    };

    const handleChangeData = async (e) => {
        e.preventDefault();

        //  the below comparison method will not work for :     x = {a: 1, b: 2};
        //                                                      y = { b: 2, a: 1 };

        if (JSON.stringify(user) === JSON.stringify(prevDetails)) {
            return dispatchAlert(
                "warning",
                "some change should be made before upadting data..."
            );
        }
        setUserLoading(true);
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/updateuser/${user._id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }
        );
        const json = await response.json();
        setUserLoading(false);

        if (json.success) {
            if (user["news letter holder"] !== isHolder) {
                if (user["news letter holder"] === false) {
                    await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/newsletter/addremove?action=remove&email=${user.email}`,
                        { method: "POST" }
                    );
                } else {
                    await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/newsletter/addremove?name=${user.user}&action=add&email=${user.email}`,
                        { method: "POST" }
                    );
                }
            }

            navigate("/account");
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    };

    useEffect(() => {
        if (auth) {
            getUser();
        } else {
            navigate("/");
        }
    }, []);

    if (loading) {
        return (
            <Spinner size="1.3rem" textSize=".9rem" text="fetching data...." />
        );
    }

    const {
        user_img,
        user: user_name,
        email,
        phone,
        location_info: { address, city, state, pincode: pinCode },
    } = user;

    return (
        <div className="contact-form-container sign-in-form-container edit-user-info-container">
            <span style={{ textAlign: "center" }}>Change information !</span>
            <form onSubmit={handleChangeData}>
                <span
                    className="user_img"
                    style={{
                        display: "block",
                        backgroundImage: `url(${user_img})`,
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
                        id="name"
                        placeholder=" "
                        onChange={(e) =>
                            setUser((prev) => {
                                return { ...prev, user: e.target.value };
                            })
                        }
                        value={user_name}
                    />
                    <label htmlFor="name">name</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder=" "
                        value={email}
                        onChange={(e) =>
                            setUser((prev) => {
                                return { ...prev, email: e.target.value };
                            })
                        }
                    />
                    <label htmlFor="email">email</label>
                </div>
                <div>
                    <input
                        type="number"
                        id="phone"
                        placeholder=" "
                        value={phone}
                        onChange={(e) =>
                            setUser((prev) => {
                                return { ...prev, phone: e.target.value };
                            })
                        }
                    />
                    <label htmlFor="phone">phone</label>
                </div>

                <div className="newsletter-toggle-container">
                    <input
                        type="checkbox"
                        id="checkbox"
                        checked={user["news letter holder"]}
                        onChange={() =>
                            setUser((prev) => {
                                return {
                                    ...prev,
                                    "news letter holder":
                                        !user["news letter holder"],
                                };
                            })
                        }
                    />
                    <label htmlFor="checkbox">News Letter</label>

                    <div className="info">
                        {user["news letter holder"] ? (
                            <>
                                <MdMarkEmailRead className="icon" />
                                <span>you will receive all the updates...</span>
                            </>
                        ) : (
                            <>
                                <RiMailCloseFill className="icon" />
                                <span>
                                    you will now not receive any updates...
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* also give an ooption to update password and then convert it to hash in backend */}
                <h3
                    style={{
                        fontSize: "2rem",
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
                        id="city"
                        placeholder=" "
                        value={city}
                        onChange={(e) =>
                            setUser((prev) => {
                                return {
                                    ...prev,
                                    location_info: {
                                        ...prev.location_info,
                                        city: e.target.value,
                                    },
                                };
                            })
                        }
                    />
                    <label htmlFor="city">city</label>
                </div>
                <div>
                    <input
                        type="text"
                        id="state"
                        placeholder=" "
                        value={state}
                        onChange={(e) =>
                            setUser((prev) => {
                                return {
                                    ...prev,
                                    location_info: {
                                        ...prev.location_info,
                                        state: e.target.value,
                                    },
                                };
                            })
                        }
                    />
                    <label htmlFor="state">state</label>
                </div>
                <div>
                    <textarea
                        id="address"
                        placeholder=" "
                        value={address}
                        onChange={(e) =>
                            setUser((prev) => {
                                return {
                                    ...prev,
                                    location_info: {
                                        ...prev.location_info,
                                        address: e.target.value,
                                    },
                                };
                            })
                        }
                    />
                    <label htmlFor="address">address info</label>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder=" "
                        required
                        value={pinCode}
                        onChange={(e) =>
                            setUser((prev) => {
                                return {
                                    ...prev,
                                    location_info: {
                                        ...prev.location_info,
                                        pincode: e.target.value,
                                    },
                                };
                            })
                        }
                    />
                    <label htmlFor="name">pincode</label>
                    <span
                        className="pincode-check"
                        style={
                            pincodes.includes(pinCode.toString())
                                ? { color: "#00a100" }
                                : { color: "#ff6b6b" }
                        }>
                        {pincodes.includes(pinCode.toString())
                            ? "* pincode available for service"
                            : "* pincode not available for service."}
                    </span>
                </div>
                {userLoading ? (
                    <Spinner
                        size=".8rem"
                        textSize=".5rem"
                        text="updating data...."
                    />
                ) : (
                    <button type="submit" className="border-btn">
                        Update
                    </button>
                )}
            </form>
        </div>
    );
};

export default ChangeDetails;
