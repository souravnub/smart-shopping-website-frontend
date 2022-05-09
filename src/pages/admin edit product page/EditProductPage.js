import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { useGlobalContext } from "../../context";
import {
    BsChatSquareDotsFill,
    BsPlusCircle,
    BsCheck2Circle,
} from "react-icons/bs";
import { IoMdThumbsUp, IoMdArrowDropleft } from "react-icons/io";
import { GrFormClose } from "react-icons/gr";
import { MdEdit, MdOutlineRestartAlt } from "react-icons/md";
import "./editPage.css";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import PageNotFound from "../PageNotFound/PageNotFound";
import defaultImg from "../../data/defaultImg";

const EditProductPage = ({ setAdminReturn }) => {
    const { dispatchAlert, genDate, theme, auth, isAdmin } = useGlobalContext();
    const { id } = useParams();

    const otherCategoryRef = useRef();
    const keyFeaturesInputRef = useRef();
    const ImgInpRef = useRef();

    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    // have to set intial values for product .... as if not then the values for the keys will be undefined which will be made defined once we will set them using db ...
    const [product, setProduct] = useState({
        name: "",
        description: "",
        available_quantity: 0,
        actualPrice: 0,
        price: 0,
        image_url: "",
        main_category: "",
    });

    const [comments, setComments] = useState([]);
    const [productImg, setProductImg] = useState("");
    const [nameVal, setNameVal] = useState("");
    const [descriptionVal, setDescriptionVal] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [otherCategories, setOtherCategories] = useState([]);
    const [priceVal, setPriceVal] = useState("");
    const [actualPriceVal, setActualPriceVal] = useState(0);
    const [AvailableQuantity, setAvailableQuantity] = useState(0);
    const [productFeatures, setProductFeatures] = useState([]);

    let ratingVal = 0;
    if (comments) {
        comments.forEach((comment) => {
            ratingVal += comment.user_rating;
        });
        ratingVal = ratingVal / comments.length;

        if (ratingVal) {
            ratingVal = ratingVal.toString();
            ratingVal = ratingVal.slice(0, 5);
        }
    }

    const handleImgInpChange = () => {
        const file = ImgInpRef.current.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                setProductImg(reader.result);
            });
            reader.readAsDataURL(file);
        } else {
            setProductImg(defaultImg);
        }
    };

    const handleAddSubCategory = (e) => {
        e.preventDefault();
        const category = otherCategoryRef.current.value;

        if (category.length === 0) {
            return dispatchAlert(
                "error",
                "cannot add an empty category into sub categories"
            );
        }

        if (otherCategories.includes(category.toLowerCase().trim())) {
            return dispatchAlert("error", "category already present");
        }

        setOtherCategories((prev) => [...prev, category]);
        otherCategoryRef.current.value = "";
    };

    const handleRemoveCategory = (category) => {
        setOtherCategories((prev) => prev.filter((c) => c !== category));
    };

    const handleAddFeature = (e) => {
        e.preventDefault();
        const feature = keyFeaturesInputRef.current.value;

        if (feature.length === 0) {
            return dispatchAlert(
                "error",
                "input value for a feature cannot be empty"
            );
        }
        if (productFeatures.includes(feature.toLowerCase().trim())) {
            return dispatchAlert("error", "feature already present");
        }
        setProductFeatures((prev) => [...prev, feature]);
        keyFeaturesInputRef.current.value = "";
    };

    const handleRemoveFeature = (feature) => {
        setProductFeatures((prev) => prev.filter((f) => f !== feature));
    };

    const handleRemoveComment = (id) => {
        setComments((prev) => prev.filter((comment) => comment._id !== id));
    };

    async function getProduct() {
        setLoading(true);
        const res = await fetch(
            `https://smart-shopping-website.herokuapp.com/api/products/getproducts?p1=${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const json = await res.json();
        setLoading(false);

        return setProduct(json[0]);
    }

    useEffect(() => {
        if (!isAdmin) {
            return <PageNotFound />;
        }
        getProduct();
    }, []);

    useEffect(() => {
        const {
            name,
            price,
            actualPrice,
            image_url,
            description,
            main_category,
            available_quantity,
            comments,
            other_categories,
            key_features,
        } = product;

        setProductImg(image_url);
        setNameVal(name);
        setDescriptionVal(description);
        setMainCategory(main_category);
        setPriceVal(price);
        setActualPriceVal(actualPrice);
        setAvailableQuantity(available_quantity);
        setComments(comments);
        setOtherCategories(other_categories);
        setProductFeatures(key_features);
    }, [product]);

    const handleUpdate = async (id) => {
        let newProduct = {
            image_url: productImg,
            _id: id,
            name: nameVal,
            price: priceVal,
            comments,
            main_category: mainCategory,
            other_categories: otherCategories,
            description: descriptionVal,
            actualPrice: actualPriceVal,
            available_quantity: AvailableQuantity,
            key_features: productFeatures,
            in_stock: AvailableQuantity > 0 ? true : false,
        };

        if (nameVal.trim().length === 0) {
            return dispatchAlert("error", "name of the product is invalid");
        } else if (priceVal <= 0 || actualPriceVal <= 0) {
            return dispatchAlert(
                "error",
                "price of the product should be more than 0"
            );
        } else if (actualPriceVal < priceVal) {
            return dispatchAlert(
                "error",
                "actual price of the product is smaller than the discount price"
            );
        } else if (descriptionVal.trim().length === 0) {
            return dispatchAlert(
                "error",
                "description of the product is invalid"
            );
        } else if (mainCategory.trim().length === 0) {
            return dispatchAlert(
                "error",
                "main_category of the product is invalid"
            );
        }

        setUpdateLoading(true);
        const response = await fetch(
            "https://smart-shopping-website.herokuapp.com/api/products/updateproducts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
                body: JSON.stringify([newProduct]),
            }
        );

        const json = await response.json();

        setUpdateLoading(false);

        if (json.success) {
            return dispatchAlert("success", `Product updated successfully !`);
        }

        return dispatchAlert("error", json.message);
    };

    const handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                setNameVal(e.target.value);
                break;
            case "price":
                setPriceVal(e.target.value);
                break;
            case "description":
                setDescriptionVal(e.target.value);
                break;
            case "main_category":
                setMainCategory(e.target.value);
                break;
            case "actual price":
                setActualPriceVal(e.target.value);
                break;
            case "available quantity":
                setAvailableQuantity(e.target.value);
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    height: "60vh",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Spinner size="1.8rem" text="fetching product..." />
            </div>
        );
    }

    return (
        <div className="edit-product-grid">
            <Link
                to="/adminPage/products"
                className="blue-link"
                onClick={() => setAdminReturn(true)}>
                <IoMdArrowDropleft />
                back to products page
            </Link>
            <Link
                to="/adminPage/dashboard"
                className="blue-link"
                onClick={() => setAdminReturn(true)}
                style={{ top: "1rem" }}>
                <IoMdArrowDropleft />
                back to dashboard
            </Link>
            <div
                className="img-container"
                style={{
                    backgroundImage: `url(${productImg})`,
                }}>
                <input
                    accept="image/*"
                    type="file"
                    ref={ImgInpRef}
                    onChange={handleImgInpChange}
                    style={{ display: "none" }}
                />
                <div className="icon-container">
                    <button
                        onClick={() => {
                            ImgInpRef.current.click();
                        }}>
                        <MdEdit />
                    </button>
                </div>
            </div>

            <div className="product-extra-info">
                <div className="mini-info-container">
                    <div>
                        <BsChatSquareDotsFill className="icon" />{" "}
                        {comments && comments.length}
                    </div>

                    <div>
                        <IoMdThumbsUp className="icon" />{" "}
                        {ratingVal ? ratingVal : 0}
                    </div>
                </div>

                <div className="comments-container">
                    {comments &&
                        comments.map((comment) => {
                            const {
                                user,
                                user_img,
                                comment: user_comment,
                                user_rating,
                                createdAt,
                                _id,
                            } = comment;

                            // display no comments if comments.length === 0

                            return (
                                <div className="comment-card" key={_id}>
                                    <button>
                                        <GrFormClose
                                            onClick={() =>
                                                handleRemoveComment(_id)
                                            }
                                        />
                                    </button>

                                    <div className="left-info">
                                        <div
                                            className="user-img"
                                            style={{
                                                backgroundImage: `url(${user_img})`,
                                            }}></div>
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
                                            starDimension="14px"
                                        />
                                    </div>

                                    <div className="user_info">
                                        <div>
                                            <span>{user}</span>
                                            <span>{genDate(createdAt)}</span>
                                        </div>
                                        <span>{user_comment}</span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="info-container">
                <span className="heading">product info</span>
                <div>
                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="name"
                        onChange={handleChange}
                        value={nameVal}
                    />
                </div>

                <div>
                    <label htmlFor="description">description</label>
                    <textarea
                        type="text"
                        name="description"
                        id="description"
                        placeholder="description"
                        onChange={handleChange}
                        rows={6}
                        value={descriptionVal}
                    />
                </div>

                <div>
                    <label htmlFor="price">price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        placeholder="price"
                        onChange={handleChange}
                        value={priceVal}
                    />
                </div>
                <div>
                    <label htmlFor="actual price">actual price</label>
                    <input
                        type="number"
                        name="actual price"
                        id="actual price"
                        placeholder="actual price"
                        onChange={handleChange}
                        value={actualPriceVal}
                    />
                </div>
                <div>
                    <label htmlFor="available quantity">
                        available quantity
                    </label>
                    <input
                        type="number"
                        name="available quantity"
                        id="available quantity"
                        placeholder="available quantity"
                        onChange={handleChange}
                        value={AvailableQuantity}
                    />
                </div>

                <div>
                    <label htmlFor="main_category">main category</label>
                    <input
                        type="text"
                        name="main_category"
                        id="main_category"
                        placeholder="main_category"
                        onChange={handleChange}
                        value={mainCategory}
                    />
                </div>

                <div className="other-categories">
                    <span className="dummy">
                        *click on the tags to remove them
                    </span>
                    <span>sub categories</span>
                    <div className="other-categories-container">
                        {otherCategories && otherCategories.length > 0 ? (
                            otherCategories.map((category) => {
                                return (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            handleRemoveCategory(category)
                                        }
                                        type="button"
                                        className="other-category">
                                        {category}
                                    </button>
                                );
                            })
                        ) : (
                            <span className="fade-heading">
                                no sub categories to display
                            </span>
                        )}
                    </div>

                    <form
                        className="other-category-input-container"
                        onSubmit={handleAddSubCategory}>
                        <input
                            ref={otherCategoryRef}
                            type="text"
                            id="other-category"
                            placeholder="add category"
                        />
                        <button type="submit">
                            <BsPlusCircle />
                        </button>
                    </form>
                </div>

                <div className="other-categories">
                    <span className="dummy">
                        *click on the tags to remove them
                    </span>
                    <span>Key features</span>
                    <div className="other-categories-container key-features-container">
                        {productFeatures && productFeatures.length > 0 ? (
                            productFeatures.map((feature) => {
                                return (
                                    <button
                                        key={feature}
                                        onClick={() =>
                                            handleRemoveFeature(feature)
                                        }
                                        type="button"
                                        className="key-feature">
                                        <BsCheck2Circle className="icon" />
                                        {feature}
                                    </button>
                                );
                            })
                        ) : (
                            <span className="fade-heading">
                                no features to display
                            </span>
                        )}
                    </div>

                    <form
                        className="other-category-input-container"
                        onSubmit={handleAddFeature}>
                        <input
                            ref={keyFeaturesInputRef}
                            type="text"
                            id="other-category"
                            placeholder="add key feature"
                        />
                        <button type="submit">
                            <BsPlusCircle />
                        </button>
                    </form>
                </div>

                {!updateLoading ? (
                    <button
                        type="submit"
                        className="feature-btn"
                        onClick={() => handleUpdate(id)}>
                        update
                    </button>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            height: "100%",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: ".5rem",
                            }}>
                            <Spinner
                                size="1.3rem"
                                text="Updating Product...."
                                textSize=".8rem"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProductPage;
