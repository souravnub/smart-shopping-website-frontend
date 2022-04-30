import React from "react";
import { useParams } from "react-router-dom";
import ProductsContainer from "../components/home/ProductsContainer";

const CategoryPage = () => {
    const { category } = useParams();

    return (
        <>
            <ProductsContainer req_category={category} />
        </>
    );
};

export default CategoryPage;
