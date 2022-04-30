import React, { useEffect, useState, useRef } from "react";
import StarRatings from "react-star-ratings";
import { useGlobalContext } from "../../context";
import { AiFillInfoCircle } from "react-icons/ai";
import { MdDoubleArrow } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaCartArrowDown, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import CategoryNavigation from "./CategoryNavigation";

// accept category here as prop and then use that /////
const ProductsContainer = ({ trending, req_category }) => {
    const {
        productsList,
        setLikedProductsList,
        likedProductsList,
        dispatchAlert,
        theme,
    } = useGlobalContext();

    const handleLikeClick = (id) => {
        const found = likedProductsList.find((item_id) => item_id === id);

        if (found) {
            let new_list = likedProductsList.filter(
                (item_id) => item_id !== id
            );

            dispatchAlert(
                "success",
                "item removed from favourites successfully"
            );

            return setLikedProductsList(new_list);
        }
        dispatchAlert("success", "item added to favourites successfully");
        return setLikedProductsList([...likedProductsList, id]);
    };

    const [listToMap, setListToMap] = useState([]);
    const [search, setSearch] = useState("");

    const handleSearchProduct = (e) => {
        e.preventDefault();
        let query = search.trim().toLowerCase();
        const list = productsList.filter((product) => {
            if (
                product.name.toLowerCase().includes(query) ||
                product.main_category.toLowerCase().includes(query) ||
                product.other_categories.includes(query)
            ) {
                return product;
            }
        });
        setListToMap(list);
    };

    useEffect(() => {
        if (trending) {
            setListToMap(
                productsList
                    .filter((product) => {
                        const { comments } = product;
                        let ratingVal = 0;
                        if (comments) {
                            comments.forEach((comment) => {
                                if (comment.user_rating) {
                                    ratingVal += comment.user_rating;
                                }
                            });
                            ratingVal = ratingVal / comments.length;
                        }

                        return ratingVal > 4;
                    })
                    .slice(0, 6)
            );
        } else if (req_category) {
            setListToMap(
                productsList.filter(
                    (product) => product.main_category === req_category
                )
            );
        } else {
            setListToMap(productsList);
        }
    }, [productsList, req_category, trending]);

    return (
        <>
            <div
                className={`main-products-container main-liked-products-cotainer`}
                style={{
                    marginTop: `${!trending ? "0" : "6rem"}`,
                }}
                id="products">
                <h1>
                    {trending
                        ? "Top Selling Products"
                        : req_category
                        ? `${
                              req_category.substring(0, 1).toUpperCase() +
                              req_category.substring(1, req_category.length)
                          }`
                        : "All Products"}
                </h1>
                {!trending && (
                    <div className="product-search">
                        <CategoryNavigation
                            current_category={
                                req_category ? req_category : "all"
                            }
                        />
                        <form
                            className="product-search-container"
                            onSubmit={handleSearchProduct}>
                            <input
                                type="text"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit">
                                <FiSearch className="icon" />
                            </button>
                        </form>
                    </div>
                )}
                <div
                    className={`products-container ${
                        !trending ||
                        (req_category === null && "liked-products-container")
                    }`}>
                    {productsList.length === 0 ? (
                        <span
                            style={{
                                fontWeight: "300",
                                fontSize: "1rem",

                                textAlign: "center",
                                margin: "4rem 0",
                            }}>
                            sorry we are currently out of stock !! New stock
                            will be added soon ... stay tuned !!
                        </span>
                    ) : listToMap.length > 0 ? (
                        listToMap.map((product) => {
                            const {
                                image_url,
                                name,
                                comments,
                                price,
                                _id,
                                actualPrice,
                                in_stock,
                            } = product;

                            let ratingVal = 0;
                            if (comments) {
                                comments.forEach((comment) => {
                                    if (comment.user_rating) {
                                        ratingVal += comment.user_rating;
                                    }
                                });
                                ratingVal = ratingVal / comments.length;
                            }
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
                                                ? {
                                                      backgroundColor:
                                                          "#70ff70",
                                                  }
                                                : {
                                                      backgroundColor:
                                                          "#ff5252",
                                                  }
                                        }>
                                        {in_stock
                                            ? "Stock Available"
                                            : "Out of Sotck"}
                                    </span>
                                    <div className="product-info">
                                        <span className="product-name">
                                            {name}
                                        </span>
                                        <div className="product-rating">
                                            <StarRatings
                                                rating={
                                                    ratingVal ? ratingVal : 0
                                                }
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
                                            <Link
                                                to={`/singleproductinfo/${_id}`}>
                                                <AiFillInfoCircle />
                                            </Link>

                                            <FaHeart
                                                style={{
                                                    fill: `${
                                                        likedProductsList.find(
                                                            (item_id) =>
                                                                item_id === _id
                                                        )
                                                            ? "#ff4747"
                                                            : theme === "dark"
                                                            ? "white"
                                                            : "black"
                                                    }`,
                                                }}
                                                onClick={() =>
                                                    handleLikeClick(_id)
                                                }
                                            />

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
                        })
                    ) : (
                        <h2
                            style={{
                                fontSize: "2.4rem",
                                opacity: 0.3,
                                textAlign: "center",
                                marginTop: "2rem",
                            }}>
                            No Products Found !
                        </h2>
                    )}
                </div>

                {trending ? (
                    <Link to="/products" className="blue-link">
                        view all products
                        <MdDoubleArrow className="icon" />
                    </Link>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default ProductsContainer;
