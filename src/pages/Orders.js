import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const Orders = () => {
    const navigate = useNavigate();
    const { auth } = useGlobalContext();

    useEffect(() => {
        // if not logged in then push to home
        if (!auth) {
            navigate("/");
        }
    }, []);

    return <div>Orders</div>;
};

export default Orders;
