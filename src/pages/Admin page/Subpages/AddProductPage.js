import React, { useState, useRef, useEffect } from "react";

import { BsPlusCircle, BsCheck2Circle } from "react-icons/bs";
import { IoMdArrowDropleft } from "react-icons/io";
import "../../admin edit product page/EditProductPage";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import defaultImg from "../../../data/defaultImg";
import PageNotFound from "../../PageNotFound/PageNotFound";
import Spinner from "../../../components/Spinner";

const AddProductPage = ({ setAdminReturn }) => {
    const { dispatchAlert, auth, isAdmin } = useGlobalContext();
    const otherCategoryRef = useRef();
    const keyFeaturesInputRef = useRef();
    const ImgRef = useRef();

    const [productImg, setProductImg] = useState(defaultImg);
    const [nameVal, setNameVal] = useState("");
    const [descriptionVal, setDescriptionVal] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [otherCategories, setOtherCategories] = useState([]);
    const [priceVal, setPriceVal] = useState("");
    const [actualPriceVal, setActualPriceVal] = useState(0);
    const [AvailableQuantity, setAvailableQuantity] = useState(0);
    const [productFeatures, setProductFeatures] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleAddSubCategory = () => {
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

    const handleAddFeature = () => {
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

    const handleImgSelect = () => {
        const file = ImgRef.current.files[0];

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

    // not working as the data url is too long...............................................
    const handleAdd = async (e) => {
        e.preventDefault();

        let newProduct = {
            image_url: productImg,
            name: nameVal,
            price: priceVal,
            main_category: mainCategory,
            other_categories: otherCategories,
            description: descriptionVal,
            actualPrice: actualPriceVal,
            available_quantity: AvailableQuantity,
            key_features: productFeatures,
            in_stock: true,
        };

        setLoading(true);

        const response = await fetch(
            "https://smart-shopping-website.herokuapp.com/api/products/addproducts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
                body: JSON.stringify(newProduct),
            }
        );

        const json = await response.json();

        setLoading(false);

        if (json.success) {
            return dispatchAlert("success", "product added successfully");
        }
        dispatchAlert("error", json.message);
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

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <form className="edit-product-grid" onSubmit={handleAdd}>
            <Link
                to="/adminPage/products"
                className="blue-link"
                onClick={() => setAdminReturn(true)}>
                <IoMdArrowDropleft />
                back to products page
            </Link>
            <div
                className="img-container"
                style={{
                    backgroundImage: `url(${productImg})`,
                }}>
                <input
                    type="file"
                    accept="image/*"
                    ref={ImgRef}
                    style={{ display: "none" }}
                    onChange={handleImgSelect}
                />
                <button
                    className="feature-btn"
                    type="button"
                    onClick={() => {
                        ImgRef.current.click();
                    }}>
                    Add Image
                </button>
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

                    <div className="other-category-input-container">
                        <input
                            ref={otherCategoryRef}
                            type="text"
                            id="other-category"
                            placeholder="add category"
                        />
                        <button type="button" onClick={handleAddSubCategory}>
                            <BsPlusCircle />
                        </button>
                    </div>
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

                    <div className="other-category-input-container">
                        <input
                            ref={keyFeaturesInputRef}
                            type="text"
                            id="other-category"
                            placeholder="add key feature"
                        />
                        <button type="button" onClick={handleAddFeature}>
                            <BsPlusCircle />
                        </button>
                    </div>
                </div>

                {!loading ? (
                    <button type="submit" className="feature-btn">
                        add product
                    </button>
                ) : (
                    <Spinner text="adding product..." />
                )}
            </div>
        </form>
    );
};

export default AddProductPage;
