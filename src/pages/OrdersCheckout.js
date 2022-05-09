import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import servicealblePinCodes from "../data/Pincodes";
import { MdArrowRight } from "react-icons/md";
import { BsCheck2All } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const OrdersCheckout = () => {
    const {
        totalSum,
        dispatchAlert,
        theme,
        setIsCartOpen,
        cartList,
        auth,
        itemCount,
        setProgress,
    } = useGlobalContext();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [productCheckLoading, setProductCheckLoading] = useState(false);

    const headers_arr = ["S No.", "Product", "Prcie", "Quantity", "Sub Total"];

    const fetchUserData = async () => {
        const response = await fetch("http://localhost:5000/api/auth/getuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: auth,
            },
        });
        const json = await response.json();

        if (!json.success) {
            return dispatchAlert("error", json.message);
        }
        const { user, phone, email } = json.user;
        const { city, state, pincode, address } = json.user.location_info;

        setName(user);
        setPhone(phone.toString());
        setEmail(email);
        setCity(city);
        setState(state);
        setPinCode(pincode.toString());
        setAddress(address);
    };

    const [isPinCodeServiceable, setIsPinCodeServiceable] = useState(false);

    useEffect(() => {
        if (cartList.length === 0) {
            navigate("/");
            dispatchAlert("error", "can't checkout as no item in the cart");
            setIsCartOpen(true);
        }
    }, []);

    useEffect(() => {
        if (auth) {
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        if (servicealblePinCodes.includes(pinCode)) {
            return setIsPinCodeServiceable(true);
        }

        return setIsPinCodeServiceable(false);
    }, [pinCode]);

    const handlePay = async (e) => {
        e.preventDefault();

        const arr = [];
        cartList.map((product) => {
            const { name, price, amount, _id } = product;
            arr.push({
                product_id: _id,
                name: name,
                price: price,
                quantity: amount,
            });
        });

        if (phone.length !== 10) {
            return dispatchAlert(
                "error",
                "Invalid phone number please try a valid one."
            );
        }

        let qs = "?";
        cartList.forEach((product, index) => {
            if (index + 1 === cartList.length) {
                qs += `p${index + 1}=${product._id}`;
            } else {
                qs += `p${index + 1}=${product._id}&`;
            }
        });

        let temepering = false;

        setProductCheckLoading(true);
        const productsFromDB_res = await fetch(
            `http://localhost:5000/api/products/getproducts${qs}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const productsFromDB_json = await productsFromDB_res.json();

        productsFromDB_json.forEach((dbProduct, idx) => {
            if (!(dbProduct.price === cartList[idx].price)) {
                temepering = true;
            }
        });
        setProductCheckLoading(false);

        let out_arr = [];
        productsFromDB_json.forEach((dbProduct, idx) => {
            if (dbProduct.available_quantity - cartList[idx].amount < 0) {
                out_arr.push("out_of_stock");
                return dispatchAlert(
                    "error",
                    `${dbProduct.name} -> out of stock range ! available quantity : ${dbProduct.available_quantity}`
                );
            }
        });

        if (temepering) {
            return dispatchAlert(
                "error",
                "price of some items on your side was changed in the cart ! please try again !"
            );
        }

        if (!(out_arr.length > 0)) {
            setProgress(30);
            const response = await fetch(
                "http://localhost:5000/orders/addorder",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_email: email,
                        buyer_info: {
                            name,
                            phone,
                            email,
                            location_info: {
                                state,
                                city,
                                pincode: pinCode,
                                address,
                            },
                        },
                        orders: arr,
                        number_of_items: itemCount,
                    }),
                }
            );

            const json = await response.json();
            setProgress(100);

            if (json.success) {
                return dispatchAlert("success", "order placed successfully...");
            }

            return dispatchAlert("error", json.message);
        }
    };

    if (productCheckLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Loading
                    width="10rem"
                    height="20rem"
                    marginInline="0"
                    marginBlock="auto"
                    lineHeight="4rem"
                    lineWidth=".1rem"
                />
                <span
                    style={{
                        fontWeight: "500",
                        textTransform: "capitalize",
                        fontSize: "1.5rem",
                        marginTop: "3rem",
                    }}>
                    Checking tempering.....
                </span>
            </div>
        );
    }

    return (
        <form className="main-orders-checkout-container" onSubmit={handlePay}>
            <h1 className="heading">
                <MdArrowRight /> Delivery Details
            </h1>
            <div className="orders-checkout-container">
                <span>Please fill in the following details...</span>
                <div className="inputs-grid">
                    <div>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder=" "
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        <label htmlFor="name">name</label>
                    </div>

                    <div>
                        <input
                            type="number"
                            maxLength={10}
                            minLength={10}
                            required
                            id="phone"
                            placeholder=" "
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                            }}
                        />
                        <label htmlFor="phone">phone</label>
                    </div>

                    <div>
                        <input
                            type="email"
                            required
                            id="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <label htmlFor="phone">email</label>
                    </div>

                    <div>
                        <input
                            type="text"
                            required
                            id="state"
                            placeholder=" "
                            value={state}
                            onChange={(e) => {
                                setState(e.target.value);
                            }}
                        />
                        <label htmlFor="state">state</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            required
                            id="city"
                            placeholder=" "
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                            }}
                        />
                        <label htmlFor="city">city</label>
                    </div>

                    <div>
                        <input
                            type="number"
                            id="pinconde"
                            placeholder=" "
                            value={pinCode}
                            onChange={(e) => {
                                setPinCode(e.target.value);
                            }}
                        />
                        <label htmlFor="pincode">PinCode</label>

                        <span
                            className="service-check"
                            style={{
                                color: isPinCodeServiceable
                                    ? theme === "dark"
                                        ? "#b0ffb0"
                                        : "#00ab00"
                                    : "#ff5454",
                            }}>
                            {isPinCodeServiceable
                                ? "* pincode available for service"
                                : "* pincode not available for service"}
                        </span>
                    </div>

                    <div className="col-2">
                        <textarea
                            id="address"
                            placeholder=" "
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                        />
                        <label htmlFor="address">Address Details</label>
                    </div>
                </div>
            </div>

            <div
                className="cart-review-container"
                style={{ marginBlock: "6rem" }}>
                <span className="heading">
                    <MdArrowRight /> Cart Overview
                </span>
                <table className="content-table" style={{ marginTop: "3rem" }}>
                    <thead>
                        <tr>
                            {headers_arr.map((header) => {
                                return <th key={header}>{header}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {cartList.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}.</td>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>{item.amount}</td>
                                    <td>${item.amount * item.price}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {cartList.length !== 0 ? (
                isPinCodeServiceable ? (
                    !loading ? (
                        <button className="enabled-btn" type="submit">
                            <BsCheck2All className="icon" />
                            <span>Pay</span> <span> ${totalSum}</span>
                        </button>
                    ) : (
                        <div
                            style={{
                                margin: "3rem 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <Loading
                                lineHeight="2rem"
                                lineWidht="0.3rem"
                                width="3rem"
                                height="3rem"
                            />
                            <span
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                }}>
                                Placing Order ...
                            </span>
                        </div>
                    )
                ) : (
                    <button
                        className="disabled"
                        type="button"
                        onClick={() =>
                            dispatchAlert("error", "pincode is not servicable")
                        }>
                        <BsCheck2All className="icon" />
                        <span>Pay</span> <span> ${totalSum}</span>
                    </button>
                )
            ) : (
                <button
                    className="disabled"
                    type="button"
                    onClick={() => {
                        navigate("/products");
                        dispatchAlert(
                            "error",
                            "your cart is empty please, build cart before continuing !"
                        );
                    }}>
                    <BsCheck2All className="icon" />
                    <span>Pay</span> <span> ${totalSum}</span>
                </button>
            )}
        </form>
    );
};

export default OrdersCheckout;
