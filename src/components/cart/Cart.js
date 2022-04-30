import React from "react";
import { useGlobalContext } from "../../context";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi";
import CartContainer from "./CartContainer";
import CartCheckOutContainer from "./CartCheckOutContainer";

const Cart = () => {
    const { isCartOpen, setIsCartOpen } = useGlobalContext();
    return (
        <div className={`cart-info ${isCartOpen === true ? "cart-open" : ""}`}>
            <span
                className="blue-link"
                onClick={() => {
                    setIsCartOpen(false);
                }}>
                <HiOutlineChevronDoubleLeft />
                Continue Shopping
            </span>

            <CartContainer />
            <CartCheckOutContainer />
        </div>
    );
};

export default Cart;
