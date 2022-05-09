import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../context";
import PageNotFound from "../PageNotFound/PageNotFound";
import Loading from "../../components/Loading";
import "./Admin page.css";
import Dashboard from "./Subpages/dashboard/Dashboard";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminPage = () => {
    const { isAdmin, adminLoading } = useGlobalContext();

    if (adminLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                    width: "50vw",
                    margin: "auto",
                }}>
                <Loading
                    width="10rem"
                    height="10rem"
                    lineHeight="3rem"
                    lineWidth=".1rem"
                />
                <h1 style={{ fontWeight: "normal", fontSize: "2rem" }}>
                    Fetching Data....
                </h1>
            </div>
        );
    }

    return isAdmin ? (
        <div className="main-admin-page-container">
            <AdminSidebar />
            <div className="data-container">
                <Dashboard />
            </div>
        </div>
    ) : (
        <PageNotFound />
    );
};

export default AdminPage;
