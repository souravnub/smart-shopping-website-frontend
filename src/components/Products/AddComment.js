import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import { useGlobalContext } from "../../context";
import Spinner from "../../components/Spinner";
import { IoMdArrowDropupCircle, IoMdArrowDropdownCircle } from "react-icons/io";

const AddComment = ({ product_id }) => {
    const { dispatchAlert, theme, fetch_products, auth } = useGlobalContext();
    const [rating, setRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAction = (type) => {
        if (type === "rating_inc") {
            return rating < 5
                ? setRating(rating + 1)
                : dispatchAlert("error", "rating can be of 5 stars only..");
        }
        return rating - 1 < 0
            ? dispatchAlert("error", "rating cannot be less than 0 ...")
            : setRating(rating - 1);
    };
    const handlePost = async () => {
        if (rating === 0) {
            return dispatchAlert(
                "error",
                "rating must not be 0 to post a review ..."
            );
        }

        setLoading(true);

        let user_data = {
            user: "Unknown",
            user_img:
                "https://th.bing.com/th/id/OIP.Cj82nzkyLKNUurmJMcSiLgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        };

        const user_res = await fetch(
            `https://smart-shopping-website.herokuapp.com/api/auth/getuser`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const user_json = await user_res.json();

        if (user_json.success) {
            user_data = {
                user: user_json.user.user,
                user_img: user_json.user.user_img,
            };
        }

        const response = await fetch(
            `https://smart-shopping-website.herokuapp.com/api/products/addcomment/${product_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    user: user_data.user,
                    user_img: user_data.user_img,
                    description: userComment,
                    rating: rating,
                }),
            }
        );

        const json = await response.json();

        setLoading(false);

        if (json.success) {
            fetch_products();
            setRating(0);
            setUserComment("");
            return dispatchAlert("success", "Product Rated Successfully....");
        } else {
            return dispatchAlert("error", json.message);
        }
    };
    return (
        <div className="main-comment-section">
            <span className="heading">Rate this product :</span>

            <div className="rating-container">
                <StarRatings
                    rating={rating}
                    starRatedColor={theme === "dark" ? "#ffff6e" : "black"}
                    numberOfStars={5}
                    starEmptyColor={theme === "dark" ? "white" : "#d4d4d4"}
                    starDimension="24px"
                />

                <div className="rating-btn-container">
                    <button onClick={() => handleAction("rating_inc")}>
                        <IoMdArrowDropupCircle />
                    </button>

                    <button onClick={() => handleAction("rating_dec")}>
                        <IoMdArrowDropdownCircle />
                    </button>
                </div>
            </div>
            <div className="rating-input-container">
                <textarea
                    rows={10}
                    type="text"
                    value={userComment}
                    onChange={(e) => {
                        setUserComment(e.target.value);
                    }}
                    placeholder="Add Your Review (optional)"
                />
            </div>

            {loading ? (
                <Spinner
                    text="adding comment..."
                    textSize=".9rem"
                    size="1.3rem"
                />
            ) : (
                <button className="btn" onClick={handlePost}>
                    POST
                </button>
            )}
        </div>
    );
};

export default AddComment;
