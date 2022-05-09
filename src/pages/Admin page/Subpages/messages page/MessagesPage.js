import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaTrash, FaReplyAll } from "react-icons/fa";
import { useGlobalContext } from "../../../../context";
import PageNotFound from "../../../PageNotFound/PageNotFound";
import "./messages page.css";

const MessagesPage = () => {
    const {
        isAdmin,
        auth,
        dispatchAlert,
        genDate,
        setReplyMessageModal,
        repliedaMessage,
        setProgress,
    } = useGlobalContext();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getMessages() {
        if (isAdmin) {
            setLoading(true);
            setProgress(10);
            const response = await fetch("http://localhost:5000/messages/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            });
            setProgress(40);
            const json = await response.json();
            setProgress(100);
            setLoading(false);
            if (json.success) {
                return setMessages(json.messages);
            } else return dispatchAlert("error", json.message);
        }
    }

    async function handleMessageDelete(id) {
        setProgress(10);
        const response = await fetch(
            `http://localhost:5000/messages/delete/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        setProgress(40);

        const json = await response.json();
        setProgress(100);

        if (json.success) {
            getMessages();
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    }

    useEffect(() => {
        getMessages();
    }, []);

    useEffect(() => {
        getMessages();
    }, [repliedaMessage]);

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <>
            <div className="main-admin-page-container">
                <AdminSidebar />

                <div className="main-messages-container">
                    <div className="heading">
                        recent messages <IoMdArrowDropdown />
                    </div>

                    <div className="messages-container">
                        {messages.length > 0 ? (
                            messages.map((message) => {
                                const {
                                    user,
                                    createdAt,
                                    message: user_message,
                                    email,
                                    _id,
                                    responded,
                                } = message;
                                return (
                                    <div className="message-card" key={_id}>
                                        <div className="head">
                                            <span className="name">{user}</span>
                                            <span className="date">
                                                {genDate(createdAt)}
                                            </span>
                                        </div>
                                        <span className="email">{email}</span>
                                        <p className="message">
                                            {user_message}
                                        </p>
                                        <div className="actions">
                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    handleMessageDelete(_id)
                                                }>
                                                <span>delete</span>
                                                <FaTrash
                                                    className="icon"
                                                    style={{
                                                        "--fill-color":
                                                            "#ff5757",
                                                    }}
                                                />
                                            </button>

                                            {responded ? (
                                                <span className="replied"></span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setReplyMessageModal(
                                                            () => {
                                                                return {
                                                                    message_info:
                                                                        {
                                                                            _id,
                                                                            user,
                                                                            email,
                                                                            createdAt,
                                                                            user_message,
                                                                        },
                                                                    show: true,
                                                                };
                                                            }
                                                        )
                                                    }
                                                    className="btn">
                                                    <span>reply</span>
                                                    <FaReplyAll
                                                        className="icon"
                                                        style={{
                                                            "--fill-color":
                                                                "#00a100",
                                                        }}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : loading ? (
                            <span className="no-messages">
                                fetching messages ....
                            </span>
                        ) : (
                            <span className="no-messages">
                                no messages to display !
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessagesPage;
