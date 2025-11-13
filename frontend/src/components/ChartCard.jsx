import React from "react";
import { Bar, Pie } from "react-chartjs-2";

export default function ChartCard({ title, type = "bar", labels, data }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div style={{ width: 400, margin: 20, textAlign: "center" }}>
      <h3>{title}</h3>
      {type === "bar" ? <Bar data={chartData} /> : <Pie data={chartData} />}
    </div>
  );
}
