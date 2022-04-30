import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import StarRatings from "react-star-ratings";
import { AiFillInfoCircle } from "react-icons/ai";
import { IoHeartDislikeSharp } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const LikedProducts = () => {
    const {
        productsList,
        likedProductsList,
        setLikedProductsList,
        dispatchAlert,
        theme,
    } = useGlobalContext();

    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        const list = [];
        if (productsList.length > 0) {
            likedProductsList.forEach((product_id) => {
                let found = productsList.find(
                    (item) => item._id === product_id
                );
                if (found) {
                    list.push(found);
                }
            });
        }
        setLikedProducts(list);
    }, [productsList, likedProductsList]);

    const handleUnlikeClick = (id) => {
        setLikedProductsList((prev) => prev.filter((item) => item !== id));
        dispatchAlert("success", "product removed from favourites.");
    };

    const handleClearLiked = () => {
        setLikedProductsList([]);
        dispatchAlert("success", "favourites list cleared .");
    };

    return likedProducts.length === 0 ? (
        <h1 style={{ textAlign: "center", marginTop: "5rem", opacity: 0.4 }}>
            No Liked Product Yet ...
        </h1>
    ) : (
        <div className="main-products-container main-liked-products-container">
            <h1>Liked Products</h1>
            <div className="products-container liked-products-container">
                {likedProducts.map((item) => {
                    const {
                        _id,
                        image_url,
                        in_stock,
                        rating,
                        name,
                        actualPrice,
                        price,
                    } = item;
                    return (
                        <div className="product" key={_id}>
                            <div
                                className="img-section"
                                style={{
                                    backgroundImage: `url(${image_url})`,
                                }}></div>
                            <span
                                style={
                                    in_stock
                                        ? { backgroundColor: "#70ff70" }
                                        : { backgroundColor: "#ff5252" }
                                }>
                                {in_stock ? "Stock Available" : "Out of Sotck"}
                            </span>
                            <div className="product-info">
                                <span className="product-name">{name}</span>
                                <div className="product-rating">
                                    <StarRatings
                                        rating={rating}
                                        starRatedColor={
                                            theme === "dark"
                                                ? "#ffff6e"
                                                : "black"
                                        }
                                        numberOfStars={5}
                                        starEmptyColor={
                                            theme === "dark"
                                                ? "white"
                                                : "#d4d4d4"
                                        }
                                        starDimension="24px"
                                    />
                                </div>
                                <span className="product-price">
                                    ${price} <span>${actualPrice}</span>{" "}
                                </span>

                                <div className="btn-container">
                                    <Link to={`/singleproductinfo/${_id}`}>
                                        <AiFillInfoCircle />
                                    </Link>

                                    <button
                                        onClick={() => handleUnlikeClick(_id)}>
                                        <IoHeartDislikeSharp />
                                    </button>

                                    {in_stock ? (
                                        <Link to={`/addtocart/${_id}`}>
                                            <FaCartArrowDown />
                                        </Link>
                                    ) : (
                                        <FaCartArrowDown className="disabled" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <span className="btn" onClick={handleClearLiked}>
                Clear All
            </span>
        </div>
    );
};

export default LikedProducts;
