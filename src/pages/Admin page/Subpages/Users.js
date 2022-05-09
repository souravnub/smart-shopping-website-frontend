import React, { useState, useEffect } from "react";
import Spinner from "../../../components/Spinner";
import { useGlobalContext } from "../../../context";
import NotFoundPage from "../../../pages/PageNotFound/PageNotFound";
import { FaTrashAlt, FaUserShield } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const Users = () => {
    const { auth, dispatchAlert, isAdmin, genDate } = useGlobalContext();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userDeleteLoading, setUserDeleteLoading] = useState(false);

    // setting headers
    let headers = [];
    if (users.length > 0) {
        headers = Object.keys(users[0]);
        let h = ["user_img"];
        headers.forEach((header) => {
            if (header !== "user_img") {
                h.push(header);
            }
        });
        h = [...h, "options"];
        headers = h;
    }

    const getUsers = async () => {
        setLoading(true);
        const response = await fetch(
            "http://localhost:5000/api/auth/getallusers",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: auth,
                },
            }
        );
        const json = await response.json();
        setLoading(false);

        if (json.success) {
            return setUsers(json.users);
        }
        return dispatchAlert("error", json.message);
    };

    const handlePromoteUser = async (id) => {
        let i = window.confirm("promote user to admin ?");

        if (i) {
            setUserDeleteLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/auth/promoteuser/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: auth,
                    },
                }
            );

            const json = await response.json();

            setUserDeleteLoading(false);
            if (json.success) {
                getUsers();
                return dispatchAlert("success", json.message);
            }
            return dispatchAlert("error", json.message);
        }
    };

    const handleUserDelete = async (id) => {
        const i = window.confirm("delete user ?");

        if (i) {
            setUserDeleteLoading(true);

            const response = await fetch(
                `http://localhost:5000/api/auth/deleteuser/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: auth,
                    },
                }
            );

            const json = await response.json();

            setUserDeleteLoading(false);

            if (json.success) {
                getUsers();

                return dispatchAlert("success", json.message);
            }

            return dispatchAlert("error", json.message);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            return <NotFoundPage />;
        }

        getUsers();
    }, []);

    return (
        <div className="main-admin-page-container">
            <AdminSidebar />

            {loading ? (
                <Spinner
                    text="fetching data...."
                    textSize="1rem"
                    size="1.4rem"
                />
            ) : (
                <div className="data-container">
                    {users.length !== 0 ? (
                        <div style={{ overflowX: "auto", maxWidth: "80vw" }}>
                            <table className="content-table">
                                <thead>
                                    <tr>
                                        {headers.map((header) => {
                                            return (
                                                <th key={header}>{header}</th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        let u = [];
                                        headers.forEach((header) => {
                                            u.push(user[header]);
                                        });

                                        return (
                                            <tr key={user._id}>
                                                {u.map((value, idx) => {
                                                    return (
                                                        <td
                                                            key={idx}
                                                            style={{
                                                                textTransform: `${
                                                                    idx === 3
                                                                        ? "none"
                                                                        : "capitalize"
                                                                }`,
                                                            }}>
                                                            {value === true ? (
                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "block",
                                                                        width: "10px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        aspectRatio:
                                                                            "1",
                                                                        marginInline:
                                                                            "auto",
                                                                        backgroundColor:
                                                                            "#94ff94",
                                                                    }}></span>
                                                            ) : value ===
                                                              false ? (
                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "block",
                                                                        width: "10px",
                                                                        borderRadius:
                                                                            "50%",
                                                                        aspectRatio:
                                                                            "1",
                                                                        marginInline:
                                                                            "auto",
                                                                        backgroundColor:
                                                                            "#ff6161",
                                                                    }}></span>
                                                            ) : idx === 0 ? (
                                                                <div
                                                                    style={{
                                                                        backgroundImage: `url(${value})`,
                                                                        backgroundPosition:
                                                                            "center center",
                                                                        backgroundSize:
                                                                            "cover",
                                                                        backgroundRepeat:
                                                                            "no-repeat",
                                                                        width: "2.34rem",
                                                                        aspectRatio:
                                                                            "1",
                                                                        borderRadius:
                                                                            "50%",
                                                                        marginInline:
                                                                            "auto",
                                                                    }}></div>
                                                            ) : idx === 5 ||
                                                              idx === 6 ? (
                                                                genDate(value)
                                                            ) : idx === 9 ? (
                                                                <div className="users-options-container">
                                                                    {userDeleteLoading ? (
                                                                        <Spinner size="1rem" />
                                                                    ) : (
                                                                        <>
                                                                            {!user.is_admin && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handlePromoteUser(
                                                                                            user._id
                                                                                        )
                                                                                    }>
                                                                                    <FaUserShield
                                                                                        style={{
                                                                                            fill: "#00c700",
                                                                                        }}
                                                                                    />
                                                                                </button>
                                                                            )}

                                                                            <button
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "auto",
                                                                                }}
                                                                                onClick={() =>
                                                                                    handleUserDelete(
                                                                                        user._id
                                                                                    )
                                                                                }>
                                                                                <FaTrashAlt
                                                                                    style={{
                                                                                        fill: "#dc4b4b",
                                                                                    }}
                                                                                />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                value
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <h1
                            style={{
                                marginTop: "6rem",
                                opacity: 0.5,
                                fontSize: "4rem",
                                fontWeight: "500",
                                textAlign: "center",
                            }}>
                            No Users Yet !
                        </h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;
