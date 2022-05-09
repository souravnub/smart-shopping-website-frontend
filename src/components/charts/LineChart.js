import React from "react";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../context";

const LineChart = ({ data }) => {
    const { theme } = useGlobalContext();

    let dummy_data = {
        labels: ["2010", "2011", "2012", "2013", "2014", "2015"],
        datasets: [
            {
                label: "Profit",

                data: [2, 3, 44, 10, 1, 34],
                borderColor: theme === "dark" ? "#eeee" : "black",
                backgroundColor: theme === "dark" ? "black" : "#eeee",
                borderWidth: 1,
                tension: 0.2,
            },
        ],
    };

    const options = {
        radius: 2,
        hitRadius: 15,
        hoverRadius: 4,
        scales: {
            yAxes: {
                grid: { color: "#9393934f" },
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        return "$" + value;
                    },
                },
            },
            xAxes: {
                grid: {
                    color: "#9393934f",
                },
            },
        },
    };

    return (
        <Line data={dummy_data} options={options}>
            LIneChart
        </Line>
    );
};

export default LineChart;
