import React from "react";
import "../pages/Admin page/Admin page.css";

const Pagination = ({ currentPage, setCurrentPage, pages }) => {
    return (
        <div className="pagination-container">
            <button
                onClick={() => {
                    if (currentPage - 1 === 0) {
                    } else {
                        setCurrentPage(currentPage - 1);
                    }
                }}>
                previous
            </button>

            {pages.map((pageNumber) => {
                return (
                    <button
                        key={pageNumber}
                        className={`${
                            currentPage === pageNumber ? "active" : ""
                        } pagination-button`}
                        onClick={() => {
                            setCurrentPage(pageNumber);
                        }}>
                        {pageNumber}
                    </button>
                );
            })}
            <button
                onClick={() => {
                    if (currentPage + 1 > pages[pages.length - 1]) {
                    } else {
                        setCurrentPage(currentPage + 1);
                    }
                }}>
                next
            </button>
        </div>
    );
};

export default Pagination;
