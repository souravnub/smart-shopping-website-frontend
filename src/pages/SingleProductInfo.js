import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import StarRatings from "react-star-ratings";
import Carousel from "react-material-ui-carousel";
import AddComment from "../components/Products/AddComment";
import { FiCheckCircle } from "react-icons/fi";

const SingleProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { productsList, dispatchAlert, setCartList, theme, genDate } =
        useGlobalContext();

    const [currentProduct, setCurrentProduct] = useState({});

    useEffect(() => {
        const newproduct = productsList.find((item) => item._id === id);

        if (newproduct !== undefined) {
            return setCurrentProduct(newproduct);
        }
    }, [id, productsList]);

    const handleBuyClick = () => {
        if (in_stock) {
            const product = productsList.find((item) => item._id === id);

            navigate("/orderscheckout");

            return setCartList([{ ...product, amount: 1 }]);
        }
        return dispatchAlert("error", "Cannot buy item as it is out of stock.");
    };

    const handleAddToCart = () => {
        if (in_stock) {
            return navigate(`/addtocart/${id}`);
        }
        return dispatchAlert(
            "error",
            "Cannot add item to cart as it is out of stock."
        );
    };

    const {
        _id,
        name,
        price,
        description,
        rating,
        image_url,
        comments,
        actualPrice,
        in_stock,
        key_features,
    } = currentProduct;

    let ratingVal = 0;
    if (comments) {
        comments.forEach((comment) => {
            ratingVal += comment.user_rating;
        });
        ratingVal = ratingVal / comments.length;
    }

    return (
        <div className="single-product-container">
            <h1>{name}</h1>
            <div className="single-product-info-container">
                <div
                    className="product-img"
                    style={{
                        backgroundImage: `url(${image_url})`,
                    }}></div>

                <div className="product-info-card">
                    <div className="product-price">
                        ${price} <span>${actualPrice}</span>{" "}
                    </div>
                    <div className="product-description">{description}</div>
                    {key_features && key_features.length > 0 ? (
                        <div className="key-features-container">
                            {key_features.map((feature, index) => {
                                return (
                                    <div className="key-feature" key={index}>
                                        <FiCheckCircle />
                                        <span className="feature-info">
                                            {feature}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className="rating-container">
                        <span>Product Rating:</span>
                        <StarRatings
                            rating={ratingVal ? ratingVal : 0}
                            starRatedColor={
                                theme === "dark" ? "#ffff6e" : "black"
                            }
                            numberOfStars={5}
                            starEmptyColor={
                                theme === "dark" ? "white" : "#d4d4d4"
                            }
                            starDimension="24px"
                        />
                    </div>
                    <div className="btn-container">
                        <button
                            className={`btn ${in_stock ? "" : "disabled"}`}
                            onClick={handleBuyClick}>
                            Buy Now
                        </button>

                        <button
                            className={`btn ${in_stock ? "" : "disabled"}`}
                            onClick={handleAddToCart}>
                            Add To Cart
                        </button>
                    </div>
                </div>

                <div className="comment-section">
                    <AddComment product_id={_id} />
                    <span>Comments:</span>

                    {comments && comments.length > 0 ? (
                        <>
                            <Carousel
                                className="carousel"
                                activeIndicatorIconButtonProps={{
                                    style: {
                                        filter: "invert(0)",
                                    },
                                }}
                                indicatorIconButtonProps={{
                                    style: {
                                        filter: "invert(0.8)",
                                    },
                                }}
                                navButtonsAlwaysVisible={true}
                                navButtonsProps={{
                                    style: {
                                        backgroundColor: "var(--logo-blob)",
                                        borderRadius: "50%",
                                        color: "var(--text-color)",
                                    },
                                }}>
                                {comments.map((item, index) => {
                                    const {
                                        user,
                                        user_img,
                                        comment,
                                        user_rating,
                                        createdAt,
                                    } = item;
                                    return (
                                        <div key={index}>
                                            <div className="comment-card">
                                                <div className="user-info">
                                                    <img
                                                        src={user_img}
                                                        alt={user}
                                                    />
                                                    <h3>{user}</h3>
                                                    <span
                                                        style={{
                                                            fontWeight: 500,
                                                            opacity: 0.7,
                                                            fontSize: ".8rem",
                                                            marginBlock:
                                                                ".4rem",
                                                        }}>
                                                        {genDate(createdAt)}
                                                    </span>
                                                </div>

                                                <div className="comment-info">
                                                    <p>{comment}</p>
                                                    <StarRatings
                                                        rating={user_rating}
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </>
                    ) : (
                        <h1 style={{ textAlign: "center", margin: "2rem 0" }}>
                            no comments yet !
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
