import React, { useState, useEffect } from "react";
import Spinner from "../../../../components/Spinner";
import { useGlobalContext } from "../../../../context";
import { IoCloseOutline } from "react-icons/io5";
import "./newsletterPage.css";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import PageNotFound from "../../../PageNotFound/PageNotFound";

const NewsletterPage = () => {
    const { dispatchAlert, auth, genDate, isAdmin, setProgress } =
        useGlobalContext();
    const [users, setUsers] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // processdEmail : which email is being removed ...... it is made so as to keep track of the user that is being deleted so as to show spinner at that place
    const [processedEmail, setProcessedEmail] = useState("");

    const headers = ["S No.", "id", "user", "email", "joined at", "actions"];

    const getUsers = async () => {
        setProgress(30);
        const response = await fetch("http://localhost:5000/newsletter/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: auth,
            },
        });
        setProgress(60);
        const json = await response.json();
        setProgress(100);

        if (json.success) {
            return setUsers(json.users);
        }
        return dispatchAlert("error", json.message);
    };

    const handleRemoveClick = async (email) => {
        setProgress(0);
        setDeleteLoading(true);
        const response = await fetch(
            `http://localhost:5000/newsletter/addremove?email=${email}&action=remove`,
            {
                method: "POST",
            }
        );
        setProgress(40);
        const json = await response.json();
        setDeleteLoading(false);
        setProgress(100);
        if (json.success) {
            getUsers();
            return dispatchAlert("success", json.message);
        }
        return dispatchAlert("error", json.message);
    };

    useEffect(() => {
        getUsers();
    }, []);

    if (!isAdmin) {
        return <PageNotFound />;
    }

    return (
        <div className="main-admin-page-container">
            <AdminSidebar />

            {users.length > 0 ? (
                <div className="data-container" style={{ overflow: "auto" }}>
                    {users && (
                        <table className="content-table">
                            <thead>
                                <tr>
                                    {headers.map((header) => {
                                        return <th key={header}>{header}</th>;
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user, idx) => {
                                    let values = [`${idx + 1}.`].concat(
                                        Object.values(user)
                                    );
                                    values.push("");
                                    return (
                                        <tr key={idx}>
                                            {values.map((value, idx) => {
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
                                                        {idx === 4 ? (
                                                            genDate(value)
                                                        ) : idx === 5 ? (
                                                            deleteLoading &&
                                                            processedEmail ===
                                                                values[3] ? (
                                                                <Spinner size=".8rem" />
                                                            ) : (
                                                                <div className="newsletter-btn-container">
                                                                    <button
                                                                        onClick={() => {
                                                                            handleRemoveClick(
                                                                                values[3]
                                                                            );
                                                                            setProcessedEmail(
                                                                                values[3]
                                                                            );
                                                                        }}>
                                                                        <IoCloseOutline />
                                                                    </button>
                                                                </div>
                                                            )
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
                    )}
                </div>
            ) : (
                <h1
                    style={{
                        marginTop: "3rem",
                        textAlign: "center",
                        fontSize: "3rem",
                        fontWeight: "500",
                        opacity: 0.4,
                        textTransform: "capitalize",
                    }}>
                    No Newsletter holders yet !
                </h1>
            )}
        </div>
    );
};

export default NewsletterPage;
