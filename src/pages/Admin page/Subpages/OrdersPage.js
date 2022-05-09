import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useGlobalContext } from "../../../context";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineLocalShipping, MdOpenWith } from "react-icons/md";
import { IoInformation } from "react-icons/io5";
import {
    BsExclamationCircle,
    BsCheckCircle,
    BsClockHistory,
} from "react-icons/bs";
import PageNotFound from "../../PageNotFound/PageNotFound";
import OrderInfoModal from "../../../components/OrderInfoModal/OrderInfoModal";
const headers = [
    "S No.",
    "ordered by",
    "product",
    "unit price",
    "quantity",
    "ordered on",
    "status",
    "sub total",
    "order id",
    "actions",
];

const OrdersPage = () => {
    const {
        auth,
        dispatchAlert,
        genDate,
        isAdmin,
        setProgress,
        setOrderInfoModal,
        edittedOrder,
        deletedOrder,
        setDeletedOrder,
    } = useGlobalContext();

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        setProgress(30);
        const response = await fetch(
            "http://localhost:5000/orders/allshoporders",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setProgress(100);

        if (json.success) {
            let main_l = [];

            json.orders.forEach((order) => {
                let ordersarr = order.orders;
                const user_email = order.buyer_info.email;

                ordersarr.forEach((order_obj) => {
                    const { name, price, quantity } = order_obj;

                    let order_ele = {
                        user_email,
                        name,
                        price: `$${price}`,
                        quantity,
                        "ordered at": genDate(order.createdAt),
                        Status: order_obj.order_status,
                        "Sub Total": ` $${
                            order_obj.price * order_obj.quantity
                        }`,
                        _id: order_obj._id,
                        orderId: order._id,
                    };

                    main_l.push(order_ele);
                });
            });
            if (main_l.length !== 0) {
                setOrders(main_l);
            }
        } else {
            dispatchAlert("error", json.message);
        }
    };

    async function handleRemoveOrder(id, orderId) {
        setProgress(40);
        const response = await fetch(
            `http://localhost:5000/orders/delete?id=${id}&orderId=${orderId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setProgress(100);

        if (json.success) {
            setDeletedOrder((prev) => prev + 1);
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [edittedOrder, deletedOrder]);

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <div className="main-admin-page-container">
            <AdminSidebar />
            <OrderInfoModal />
            <div style={{ overflowX: "auto", maxWidth: "80vw" }}>
                {orders.length !== 0 ? (
                    <table className="content-table">
                        <thead>
                            <tr>
                                {headers.map((header) => {
                                    return <th key={header}>{header}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx) => {
                                const values = [`${idx + 1}.`].concat(
                                    Object.values(order)
                                );
                                return (
                                    <tr key={idx}>
                                        {values.map((value, idx) => {
                                            return (
                                                // done so that order Id should not be shown in table
                                                idx !== values.length - 1 && (
                                                    <td
                                                        key={idx}
                                                        style={{
                                                            textTransform: `${
                                                                idx === 1
                                                                    ? "none"
                                                                    : "capitalize"
                                                            }`,
                                                        }}>
                                                        {value === "pending" ? (
                                                            <div
                                                                className="value-container"
                                                                style={{
                                                                    "--fill-color":
                                                                        "#5e5eff",
                                                                }}>
                                                                <BsClockHistory />
                                                                Pending
                                                            </div>
                                                        ) : value ===
                                                          "declined" ? (
                                                            <div
                                                                className="value-container"
                                                                style={{
                                                                    "--fill-color":
                                                                        "#f36741",
                                                                }}>
                                                                <BsExclamationCircle />
                                                                declined
                                                            </div>
                                                        ) : value ===
                                                          "shipped" ? (
                                                            <div
                                                                className="value-container"
                                                                style={{
                                                                    "--fill-color":
                                                                        "#327532",
                                                                }}>
                                                                <MdOutlineLocalShipping />
                                                                Shipped
                                                            </div>
                                                        ) : value ===
                                                          "delivered" ? (
                                                            <div
                                                                className="value-container"
                                                                style={{
                                                                    "--fill-color":
                                                                        "#00ad00",
                                                                }}>
                                                                <BsCheckCircle />
                                                                Delivered
                                                            </div>
                                                        ) : value ===
                                                          "dispatched" ? (
                                                            <div
                                                                className="value-container"
                                                                style={{
                                                                    "--fill-color":
                                                                        "#c0a01d",
                                                                }}>
                                                                <MdOpenWith />
                                                                Dispatched
                                                            </div>
                                                        ) : (
                                                            value
                                                        )}
                                                    </td>
                                                )
                                            );
                                        })}
                                        <td className="orders-actions-container">
                                            <button
                                                onClick={() => {
                                                    setOrderInfoModal({
                                                        show: true,
                                                        order_info: order,
                                                    });
                                                }}>
                                                <IoInformation />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveOrder(
                                                        order._id,
                                                        order.orderId
                                                    )
                                                }>
                                                <GrFormClose />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <h1
                        style={{
                            marginTop: "6rem",
                            opacity: 0.5,
                            fontSize: "4rem",
                            fontWeight: "500",
                            textAlign: "center",
                        }}>
                        No Orders Yet !
                    </h1>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
