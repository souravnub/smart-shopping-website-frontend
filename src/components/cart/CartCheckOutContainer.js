import React from "react";
import { useGlobalContext } from "../../context";
import { AiFillTag } from "react-icons/ai";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { FaApplePay } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartCheckOutContainer = () => {
    const { totalSum, cartList, setIsCartOpen, dispatchAlert } =
        useGlobalContext();
    return (
        <div className="cart-checkout-container">
            <h3>order summary</h3>

            <div className="promo-code">
                <AiFillTag />
                <span>have a promocode?</span>
            </div>

            <div className="cart-checkout-info ">
                <div>
                    <span>
                        <span> merchandise</span>
                        <BsFillQuestionCircleFill className="icon" />
                    </span>
                    <span className="price">${totalSum}</span>
                </div>

                <div>
                    <span>
                        <span>Estimated Shipping</span>
                        <BsFillQuestionCircleFill className="icon" />
                    </span>
                    <span className="price">FREE</span>
                </div>
            </div>

            <div className="order-total">
                <div>
                    <span>order total :</span>
                    <span className="price">${totalSum}</span>
                </div>
            </div>

            {cartList.length === 0 ? (
                <Link
                    to="#"
                    onClick={() => {
                        dispatchAlert(
                            "warning",
                            "cannot proceed... no item in cart"
                        );
                    }}
                    style={{ cursor: "pointer" }}
                    className="proceed disabled">
                    Proceed and checkout
                </Link>
            ) : (
                <Link
                    to="/orderscheckout"
                    onClick={() => {
                        setIsCartOpen(false);
                    }}
                    className="proceed">
                    Proceed and checkout
                </Link>
            )}

            <div className="payment-method">
                <FaApplePay className="icon" />{" "}
                <span>available in checkout</span>
            </div>
        </div>
    );
};

export default CartCheckOutContainer;
