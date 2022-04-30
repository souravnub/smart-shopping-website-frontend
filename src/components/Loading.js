import React from "react";

const Loading = ({
    lineHeight,
    lineWidth,
    width,
    height,
    marginInline,
    marginBlock,
}) => {
    return (
        <svg
            style={{
                width,
                height,
                display: "block",
                marginInline,
                marginBlock,
            }}
            version="1.1"
            id="L9"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 0 0"
            xmlSpace="preserve">
            <rect
                x="1.5rem"
                y="1.2rem"
                width={lineWidth}
                height={lineHeight}
                fill="var(--text-color)">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 40; 0 0"
                    begin="0"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect
                x="2.5rem"
                y="1.2rem"
                width={lineWidth}
                height={lineHeight}
                fill="var(--text-color)">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 40; 0 0"
                    begin="0.2s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect
                x="3.5rem"
                y="1.2rem"
                width={lineWidth}
                height={lineHeight}
                fill="var(--text-color)">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 40; 0 0"
                    begin="0.4s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
        </svg>
    );
};

export default Loading;
