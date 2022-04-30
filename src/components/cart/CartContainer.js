import React from "react";
import { useGlobalContext } from "../../context";
import {
    IoMdArrowDropright,
    IoMdArrowDropupCircle,
    IoMdArrowDropdownCircle,
} from "react-icons/io";

const CartContainer = () => {
    const { cartList, setCartList, dispatchAlert } = useGlobalContext();

    const handleAction = (event, id) => {
        const new_list = cartList.filter((item) => {
            if (item._id === id) {
                if (event === "increment") {
                    item.amount += 1;
                } else {
                    if (!(item.amount - 1 < 1)) {
                        item.amount -= 1;
                    } else {
                        dispatchAlert(
                            "error",
                            "quantity cannot be less than 1"
                        );
                    }
                }

                return item;
            }
            return item;
        });
        setCartList(new_list);
    };

    const handleRemove = (id) => {
        return setCartList((prev) => prev.filter((item) => item._id !== id));
    };

    return (
        <div className="cart-main">
            {cartList.length === 0 ? (
                <h3>Your Cart Is Empty</h3>
            ) : (
                <>
                    <div className="cart-item-container">
                        {cartList.map((item) => {
                            const {
                                image_url: img,
                                name,
                                _id,
                                price,
                                amount,
                            } = item;
                            return (
                                <div className="cart-item" key={_id}>
                                    <div
                                        className="item-image-container"
                                        style={{
                                            backgroundImage: `url(${img})`,
                                        }}></div>

                                    <div className="item-info">
                                        <h3 className="underline">{name}</h3>

                                        <div className="main-item-info-container">
                                            <div className="price-container">
                                                <span>Price</span>
                                                <IoMdArrowDropright />
                                                <span>${price}</span>
                                            </div>

                                            <div className="amount-container">
                                                <span>Amount:</span>
                                                <IoMdArrowDropright />

                                                <div className="amount-main">
                                                    <span>{amount}</span>

                                                    <div className="btn-container">
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    "increment",
                                                                    _id
                                                                )
                                                            }>
                                                            <IoMdArrowDropupCircle />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    "decrement",
                                                                    _id
                                                                )
                                                            }>
                                                            <IoMdArrowDropdownCircle />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(_id)}
                                            className="remove-item-btn">
                                            remove
                                        </button>
                                    </div>

                                    <div className="net-total">
                                        <span>
                                            Sub Total : ${price * amount}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="clear-cart-btn"
                        onClick={() => {
                            setCartList([]);
                            dispatchAlert("success", "cart cleared");
                        }}>
                        Clear Cart
                    </button>
                </>
            )}
        </div>
    );
};

export default CartContainer;
