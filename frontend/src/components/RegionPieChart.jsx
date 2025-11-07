import React from "react";
import { Pie } from "react-chartjs-2";

export default function RegionPieChart({ data }) {
  if (!data) return null;
  const labels = data.map(d => d._id);
  const values = data.map(d => d.total);
  const chartData = { labels, datasets: [{ data: values }] };
  return (
    <div>
      <h3>Ventas por región</h3>
      <Pie data={chartData} />
    </div>
  );
}
