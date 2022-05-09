import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../../context";
import { GrFormClose } from "react-icons/gr";
import {
    MdDeleteForever,
    MdEdit,
    MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import "./orderInfoModal.css";

const OrderInfoModal = () => {
    const {
        orderInfoModal,
        setOrderInfoModal,
        auth,
        dispatchAlert,
        setProgress,
        setEdittedOrder,
        setDeletedOrder,
    } = useGlobalContext();

    const [error, setError] = useState(true);
    const [prevStatus, setPrevStatus] = useState("pending");
    const [currentStatus, setCurrentStatus] = useState("pending");

    useEffect(() => {
        setPrevStatus(orderInfoModal.order_info.Status);
        setCurrentStatus(orderInfoModal.order_info.Status);
    }, [orderInfoModal]);

    const statusOptions = [
        "pending",
        "dispatched",
        "shipped",
        "declined",
        "delivered",
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (orderInfoModal.show) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [orderInfoModal]);

    useEffect(() => {
        setIsMenuOpen(false);
        if (currentStatus !== prevStatus) {
            return setError(false);
        }
        setError(true);
    }, [currentStatus]);

    function closeModal() {
        setOrderInfoModal({ show: false, order_info: {} });
    }

    async function handleEditOrder(id, orderId) {
        if (prevStatus === currentStatus) {
            return setError(true);
        }
        setProgress(20);
        const response = await fetch(
            `https://smart-shopping-website.herokuapp.com/orders/edit?id=${id}&orderId=${orderId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
                body: JSON.stringify({
                    order_status: currentStatus,
                }),
            }
        );
        const json = await response.json();
        setProgress(100);
        setOrderInfoModal({ show: false, order_info: {} });
        if (json.success) {
            setEdittedOrder((prev) => prev + 1);
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    }

    async function handleRemoveOrder(id, orderId) {
        setProgress(30);
        const response = await fetch(
            `https://smart-shopping-website.herokuapp.com/orders/delete?id=${id}&orderId=${orderId}`,
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
            setOrderInfoModal({ show: false, order_info: {} });
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    }

    return (
        <div
            className={`main-order-info-modal-container ${
                orderInfoModal.show && "open-modal"
            }`}>
            <div className="order-info-modal-container">
                <div className="head">
                    <div className="info">
                        <span>order info</span>
                        <div className="more-info">
                            <span className="user-email">
                                {orderInfoModal.order_info.user_email}
                            </span>
                            <span className="error">
                                {error &&
                                    "* some changes are needed to be made before continuing"}
                            </span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={closeModal}>
                        <GrFormClose />
                    </button>
                </div>
                <div className="order-info-modal-info-container">
                    <span>
                        <span>
                            name <BsArrowRightShort />
                        </span>
                        <span>{orderInfoModal.order_info.name}</span>
                    </span>
                    <span>
                        <span>
                            quantity <BsArrowRightShort />
                        </span>
                        <span>{orderInfoModal.order_info.quantity}</span>
                    </span>
                    <span>
                        <span>
                            unit price
                            <BsArrowRightShort />
                        </span>
                        <span>{orderInfoModal.order_info["price"]}</span>
                    </span>
                    <span>
                        <span>
                            sub total
                            <BsArrowRightShort />
                        </span>
                        <span>{orderInfoModal.order_info["Sub Total"]}</span>
                    </span>
                    <span>
                        <span>
                            ordered at
                            <BsArrowRightShort />
                        </span>
                        <span>
                            {orderInfoModal.order_info["ordered at"] &&
                                orderInfoModal.order_info["ordered at"].trim()}
                        </span>
                    </span>

                    <div
                        className="select-status-menu-container"
                        role="button"
                        aria-pressed="false"
                        tabIndex="0"
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                setIsMenuOpen((prev) => !prev);
                            } else if (e.key === "Enter") {
                                setIsMenuOpen((prev) => !prev);
                            } else return;
                        }}
                        onClick={() => setIsMenuOpen((prev) => !prev)}>
                        <span>{currentStatus}</span>
                        <MdOutlineKeyboardArrowDown />
                        <div
                            className={`status-options-container ${
                                isMenuOpen && "open-menu"
                            }`}>
                            {statusOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setCurrentStatus(option);
                                    }}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="order-action-btn-container">
                        <button
                            style={{ "--fill-color": "#00c700" }}
                            onClick={() =>
                                handleEditOrder(
                                    orderInfoModal.order_info._id,
                                    orderInfoModal.order_info.orderId
                                )
                            }>
                            <MdEdit style={{ fill: "#00c700" }} />
                            edit
                        </button>
                        <button
                            style={{ "--fill-color": "#f36741" }}
                            onClick={() =>
                                handleRemoveOrder(
                                    orderInfoModal.order_info._id,
                                    orderInfoModal.order_info.orderId
                                )
                            }>
                            <MdDeleteForever style={{ fill: "#f36741" }} />
                            remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInfoModal;
