import React from "react";
import "./PageNotFound.css";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="not-found-main-container">
            <div className="headings-container">
                <span className="not-found-heading not-found-main-heading">
                    oops
                </span>
                <span className="not-found-heading">!</span>
            </div>
            <span className="sub-heading">404 - page not found</span>
            <span className="info">
                The page you are looking for might have been removed or had its
                name changed or might have been removed or is currently
                unavailable.
            </span>
            <Link to="/">go to home page</Link>
        </div>
    );
};

export default PageNotFound;
