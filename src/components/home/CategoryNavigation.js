import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import { Link } from "react-router-dom";
const CategoryNavigation = ({ current_category }) => {
    const { productsList } = useGlobalContext();

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        if (productsList) {
            let arr = ["all"];

            productsList.forEach((ele) => {
                if (arr.includes(ele.main_category)) {
                    return;
                }
                return arr.push(ele.main_category);
            });

            setCategoryList(arr);
        }
    }, [productsList]);

    return (
        <div className="category-nav">
            <div className="category-links-container">
                {categoryList.map((category) => {
                    return (
                        <Link
                            key={category}
                            to={
                                category === "all"
                                    ? "/products"
                                    : `/products/${category}`
                            }
                            className={`${
                                current_category === category ? "active" : ""
                            }`}>
                            {category[0].toUpperCase() +
                                category.substring(1, category.length)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryNavigation;
