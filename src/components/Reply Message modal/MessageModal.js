import React, { useRef, useEffect, useState } from "react";
import "./ReplyMessageModal.css";
import { useGlobalContext } from "../../context";
import { IoClose } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";

const ReplyMessageModal = () => {
    const {
        ReplyMessageModal,
        setReplyMessageModal,
        genDate,
        dispatchAlert,
        auth,
        setRepliedaMessage,
        setProgress,
    } = useGlobalContext();
    const modalRef = useRef();

    const [reply, setReply] = useState("");
    const [error, setError] = useState(true);

    useEffect(() => {
        if (ReplyMessageModal.show) {
            modalRef.current.classList.add("open-modal");
        } else {
            modalRef.current.classList.remove("open-modal");
        }
    }, [ReplyMessageModal]);

    useEffect(() => {
        if (reply.trim().length > 3) {
            setError(false);
        } else {
            setError(true);
        }
    }, [reply]);

    async function handleReply(id) {
        if (!error) {
            setError(null);
            setProgress(10);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/messages/reply/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: auth,
                    },
                    body: JSON.stringify({ reply: reply }),
                }
            );
            setProgress(50);

            const json = await response.json();
            setProgress(100);
            if (json.success) {
                setRepliedaMessage((prev) => prev + 1);
                setReplyMessageModal({ show: false, message_info: {} });
                setReply("");
                return dispatchAlert("success", json.message);
            }
            return dispatchAlert("error", json.message);
        }
    }

    const { _id, user, createdAt, email, user_message } =
        ReplyMessageModal.message_info;

    return (
        <div className="main-reply-message-modal" ref={modalRef}>
            <div className="reply-message-modal-content">
                <span className="heading">Reply To Message</span>

                <div className="main-content-container">
                    <div className="message-card">
                        <div className="head">
                            <span className="name">{user && user}</span>
                            <span className="date">
                                {genDate(createdAt && createdAt)}
                            </span>
                        </div>
                        <span className="email">{email && email}</span>
                        <p className="message">
                            {user_message && user_message}
                        </p>
                    </div>

                    <div className="reply-container">
                        <span className="head">
                            Your reply <IoMdArrowDropdown />
                        </span>
                        <textarea
                            rows="10"
                            placeholder="Your Reply Here"
                            onChange={(e) => setReply(e.target.value)}
                            value={reply}></textarea>
                    </div>

                    <button onClick={() => handleReply(_id)}>Reply</button>
                    {error && (
                        <span
                            style={{
                                fontSize: ".78rem",
                                color: "#ec4e24",
                                display: "block",
                                textAlign: "center",
                                marginTop: ".5rem",
                                textTransform: "capitalize",
                            }}>
                            * reply should be grater than 3 characters
                        </span>
                    )}
                </div>
                <button
                    onClick={() => {
                        setReplyMessageModal({ message_info: {}, show: false });
                        setReply("");
                    }}
                    className="modal-btn">
                    <IoClose />
                </button>
            </div>
        </div>
    );
};

export default ReplyMessageModal;
