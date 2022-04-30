import React from "react";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({ size, textSize, direction, text }) => {
    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: direction ? direction : "row",
                    flexWrap: "warp",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: ".5rem",
                }}>
                <FaSpinner className="spinner" style={{ "--size": size }} />
                {text && (
                    <span
                        style={{
                            fontSize: textSize ? textSize : "1rem",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                        }}>
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Spinner;
