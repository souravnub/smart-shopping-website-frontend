import React from "react";
import { MdEdit, MdMarkEmailRead } from "react-icons/md";
import { useGlobalContext } from "../../context";
import { Link } from "react-router-dom";

const AccountDetails = ({ user }) => {
    const { genDate } = useGlobalContext();

    return (
        <div className="main-account-details-container">
            <div className="top-container">
                <span className="heading">My detail</span>
                <Link className="edit-btn" to="/updateinfo">
                    <MdEdit />
                </Link>
            </div>
            <div className="personal-info-container">
                <span className="container-heading underline">
                    personal information
                </span>

                <div className="grid-col-2">
                    <div className="left-container">
                        <div
                            className="person-img"
                            style={{
                                backgroundImage: `url(${user.user_img})`,
                            }}></div>

                        <span className="sub-heading">
                            Assertively utilize adaptive customer service for
                            future-proof platforms.Completely drive optimal
                            markets.
                        </span>
                    </div>

                    <div className="personal-info">
                        <div>
                            <span className="sub-title">name</span>
                            <span className="main-info">{user.user}</span>
                            <span className="main-info">
                                {user["news letter holder"] && (
                                    <MdMarkEmailRead className="icon" />
                                )}
                            </span>
                        </div>

                        <div>
                            <span className="sub-title">email</span>
                            <span className="main-info">{user.email}</span>
                        </div>

                        <div>
                            <span className="sub-title">phone number</span>
                            <span className="main-info">{user.phone}</span>
                        </div>

                        <div>
                            <span className="sub-title">signed up at</span>
                            <span className="main-info">
                                {genDate(user.createdAt)}
                            </span>
                        </div>

                        <div>
                            <span className="sub-title">last upadted at</span>
                            <span className="main-info">
                                {genDate(user.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
