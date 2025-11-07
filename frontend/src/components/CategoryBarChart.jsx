import React from "react";
import { Bar } from "react-chartjs-2";

export default function CategoryBarChart({ data }) {
  if (!data) return null;
  const labels = data.map(d => d._id);
  const values = data.map(d => d.total);
  const chartData = {
    labels,
    datasets: [{ label: "Total", data: values }]
  };
  return (
    <div>
      <h3>Ventas por categoría</h3>
      <Bar data={chartData} />
    </div>
  );
}
