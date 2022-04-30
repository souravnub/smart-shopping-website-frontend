import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context";
import { BiPlusCircle } from "react-icons/bi";
import { BiMinusCircle } from "react-icons/bi";
import { BiChevronsRight } from "react-icons/bi";

const AddToCart = () => {
    const { productsList, cartList, setCartList, setTempState, dispatchAlert } =
        useGlobalContext();
    const { id } = useParams();
    const [item, setItem] = useState({});

    const [itemCount, setItemCount] = useState(1);

    useEffect(() => {
        const newproduct = productsList.filter((item) => item._id === id)[0];
        if (newproduct) {
            return setItem(newproduct);
        }
    }, [id, productsList]);

    const handleAddToCart = () => {
        let found = cartList.find((item) => {
            return item._id === id;
        });

        if (cartList.indexOf(found) !== -1) {
            found.amount += itemCount;

            let new_cart_list = cartList;
            new_cart_list[cartList.indexOf(found)] = found;

            setTempState((prev) => (prev += 2));

            dispatchAlert(
                "success",
                `${name.toUpperCase()} - added to cart successfully . Quantiy : ${itemCount}`
            );
            return setCartList(new_cart_list);
        }

        dispatchAlert(
            "success",
            `${name.toUpperCase()} -  added to cart successfully . Quantiy : ${itemCount}`
        );
        return setCartList([
            ...cartList,
            {
                name,
                price,
                amount: itemCount,
                actualPrice,
                image_url,
                information: description,
                _id: id,
            },
        ]);
    };

    const { name, price, image_url, actualPrice, description } = item;
    return (
        item && (
            <div className="main-product-checkout-container">
                <div className="product-details">
                    <div
                        className="product-img"
                        style={{
                            backgroundImage: `url(${image_url})`,
                        }}></div>

                    <div className="main-info">
                        <span> {name} </span>
                        <div className="price-section">
                            <span>${price}</span>
                            <span style={{ fontSize: "1rem" }}>/Item</span>
                        </div>

                        <div className="amount-change-container">
                            <button
                                onClick={() => {
                                    if (itemCount - 1 < 1) {
                                        return; //pass
                                    }
                                    return setItemCount(
                                        (prevcount) => prevcount - 1
                                    );
                                }}>
                                <BiMinusCircle />
                            </button>

                            <span>{itemCount}</span>

                            <button
                                onClick={() =>
                                    setItemCount((prevcount) => prevcount + 1)
                                }>
                                <BiPlusCircle />
                            </button>
                        </div>

                        <div className="cost-info">
                            <span className="sub-total">
                                sub-total
                                <BiChevronsRight />
                                <span>
                                    ${itemCount ? price * itemCount : price}
                                </span>
                            </span>
                        </div>

                        <button className="add-btn" onClick={handleAddToCart}>
                            add to cart
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddToCart;
