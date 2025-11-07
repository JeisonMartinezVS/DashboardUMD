// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function App() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sales").then((res) => setSales(res.data));
  }, []);

  const barData = {
    labels: sales.map((s) => s.month),
    datasets: [
      {
        label: "Ventas por mes",
        data: sales.map((s) => s.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const pieData = {
    labels: sales.map((s) => s.product),
    datasets: [
      {
        label: "Ventas por producto",
        data: sales.map((s) => s.quantity),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>📊 Dashboard de Ventas NoSQL</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px" }}>
        <div style={{ width: "500px" }}>
          <h3>Ventas por Mes</h3>
          <Bar data={barData} />
        </div>
        <div style={{ width: "400px" }}>
          <h3>Distribución por Producto</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
