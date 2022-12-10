import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import "../Admin page.css";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import Spinner from "../../../components/Spinner";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import PageNotFound from "../../PageNotFound/PageNotFound";

const ProductsPage = () => {
    const { dispatchAlert, productsList, auth, isAdmin } = useGlobalContext();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCategory, setCurrentCategory] = useState("all");
    let productsPerPage = 6;

    async function handleDelete(id, name) {
        setLoading(true);

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/products/deleteproducts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
                body: JSON.stringify([id]),
            }
        );
        const json = await response.json();

        setLoading(false);

        if (json.success) {
            dispatchAlert("success", `${name} deleted successfully..`);
            return getData();
        }
        return dispatchAlert("error", json.message);
    }

    const handleMenuToggle = (event) => {
        if (
            event.key === " " ||
            event.key === "Enter" ||
            event.key === "Spacebar"
        ) {
            setIsMenuOpen((prev) => !prev);
        }
    };

    async function getData() {
        setLoading(true);

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/products/getproductsbycategory?category=${currentCategory}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const json = await response.json();

        setLoading(false);

        if (!json.success) {
            return dispatchAlert("error", json.message);
        }

        setProducts(json.products);
    }

    let categories = ["all"];

    productsList.forEach((product) => {
        if (!categories.includes(product.main_category)) {
            categories.push(product.main_category);
        }
    });

    let indexOfFirstProduct = currentPage * productsPerPage - productsPerPage;
    let indexOfLastProduct = currentPage * productsPerPage;
    let currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const pages = [];
    for (let i = 0; i < Math.ceil(products.length / productsPerPage); i++) {
        pages.push(i + 1);
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setIsMenuOpen(false);
        getData();
    }, [currentCategory]);

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <div className="main-admin-page-container">
            <AdminSidebar />

            {loading ? (
                <Spinner
                    size="1.9rem"
                    fontSize=".9rem"
                    text="fetching products...."
                />
            ) : (
                <div className="data-container">
                    <div className="main-admin-products-container">
                        <div className="head-container">
                            <span>
                                No. of Products <IoMdArrowDropright />{" "}
                                {products.length}
                            </span>
                            <div
                                role="button"
                                aria-pressed="false"
                                tabIndex="0"
                                className="drop-down"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                onKeyDown={handleMenuToggle}>
                                <span>{currentCategory}</span>
                                <IoMdArrowDropdown />
                                <ul className={`${isMenuOpen && "open-menu"}`}>
                                    {categories.map((category) => (
                                        <li key={category}>
                                            <button
                                                className={`drop-down-option ${
                                                    currentCategory ===
                                                        category && "active"
                                                }`}
                                                onClick={() =>
                                                    setCurrentCategory(category)
                                                }>
                                                <span>{category}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="admin-products-container">
                            {currentProducts.map((product) => {
                                const {
                                    name,
                                    price,
                                    actualPrice,
                                    image_url,
                                    _id,
                                } = product;
                                return (
                                    <div
                                        className="admin-product-card"
                                        key={_id}>
                                        <div
                                            className="product-img-container"
                                            style={{
                                                backgroundImage: `url(${image_url})`,
                                            }}></div>
                                        <div className="product-info-container">
                                            <span>{name}</span>
                                            <div className="price-container">
                                                <span>${price}</span>
                                                <span>${actualPrice}</span>
                                            </div>
                                            <div className="btn-container">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/editproduct/${_id}`
                                                        )
                                                    }>
                                                    <MdEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(_id, name)
                                                    }>
                                                    <MdDeleteForever /> delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            pages={pages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
