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
  const [contratos, setContratos] = useState([]);
  const [tab, setTab] = useState("contratos");
  const [consulta, setConsulta] = useState("servicios");

  // 🔹 Cargar datos
  useEffect(() => {
    axios
      .get("https://dashboardumd.onrender.com/api/contratos")
      .then((res) => setContratos(res.data))
      .catch((err) => console.error("Error al cargar contratos", err));
  }, []);

  // 🔹 Normalización
  const contratosData = contratos.map((c) => ({
    id: c._id,
    cliente: c.Contrato?.Cliente || "—",
    estado: c.Contrato?.EstadoContrato || "—",
    valor: c.Contrato?.ValorTotal || 0,
    vendedor: c.Contrato?.Vendedor || "—",
    fechaInicio: c.Contrato?.FechaInicio || null,
    fechaFin: c.Contrato?.FechaFin || null,
    detalles: c.Contrato?.Detalles || [],
  }));

  // 🔹 Métricas generales
  const totalContratos = contratosData.length;
  const contratosActivos = contratosData.filter((c) => c.estado === "Activo").length;
  const contratosFinalizados = contratosData.filter((c) => c.estado === "Finalizado").length;
  const valorTotal = contratosData.reduce((acc, c) => acc + (c.valor || 0), 0);

  // 🔹 Datos para gráficas principales
  const barData = {
    labels: contratosData.map((c) => c.cliente),
    datasets: [
      {
        label: "Valor del Contrato ($)",
        data: contratosData.map((c) => c.valor),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Activos", "Finalizados"],
    datasets: [
      {
        data: [contratosActivos, contratosFinalizados],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // === 🔍 CONSULTAS DINÁMICAS ===
  let consultaData = { labels: [], datasets: [] };

  if (consulta === "servicios") {
    // Agrupar servicios y contar cuántas veces aparecen
    const servicios = {};
    contratosData.forEach((c) =>
      c.detalles.forEach((d) => {
        servicios[d.Servicio] = (servicios[d.Servicio] || 0) + d.Cantidad;
      })
    );

    consultaData = {
      labels: Object.keys(servicios),
      datasets: [
        {
          label: "Servicios más contratados",
          data: Object.values(servicios),
          backgroundColor: ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"],
        },
      ],
    };
  }

  if (consulta === "vendedores") {
    // Agrupar por vendedor y sumar el valor total de sus contratos
    const vendedores = {};
    contratosData.forEach((c) => {
      vendedores[c.vendedor] = (vendedores[c.vendedor] || 0) + c.valor;
    });

    consultaData = {
      labels: Object.keys(vendedores),
      datasets: [
        {
          label: "Valor total vendido ($)",
          data: Object.values(vendedores),
          backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
        },
      ],
    };
  }

  // ============================ UI ============================
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">📊 Dashboard Administrativo — UMD</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {["contratos", "consultas"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold shadow-md transition ${
              tab === t ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"
            }`}
          >
            {t === "contratos"
              ? "📑 Contratos"
              : t === "resumen"
              ? "📈 Resumen"
              : "🔍 Consultas"}
          </button>
        ))}
      </div>

      {/* === Sección Contratos === */}
      {tab === "contratos" && (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <KPI title="Total Contratos" value={totalContratos} color="text-blue-600" />
            <KPI title="Activos" value={contratosActivos} color="text-green-600" />
            <KPI title="Finalizados" value={contratosFinalizados} color="text-gray-600" />
            <KPI title="Valor Total" value={`$${valorTotal.toLocaleString()}`} color="text-amber-600" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
            <Card title="Valor por Cliente" w="w-[90%] lg:w-[45%]">
              <Bar data={barData} />
            </Card>

            <Card title="Estados de Contratos" w="w-[90%] lg:w-[35%]">
              <Pie data={pieData} />
            </Card>
          </div>

          <Card title="📋 Detalle de Contratos" w="w-full mt-12 overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Vendedor</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Inicio</th>
                  <th className="p-3">Fin</th>
                </tr>
              </thead>
              <tbody>
                {contratosData.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{c.cliente}</td>
                    <td className="p-3">{c.vendedor}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-sm font-semibold ${
                          c.estado === "Activo"
                            ? "bg-green-100 text-green-700"
                            : c.estado === "Finalizado"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="p-3">${c.valor.toLocaleString()}</td>
                    <td className="p-3">
                      {c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3">
                      {c.fechaFin ? new Date(c.fechaFin).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* === Sección Consultas === */}
      {tab === "consultas" && (
        <div className="flex flex-col items-center gap-6">
          <Card title="🔎 Consultas Interactivas" w="w-full lg:w-[60%]">
            <div className="flex justify-center mb-6">
              <select
                className="p-3 border rounded-lg shadow-sm"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
              >
                <option value="servicios">Servicios más contratados</option>
                <option value="vendedores">Vendedores con más valor</option>
              </select>
            </div>

            <div className="p-4">
              <Bar data={consultaData} />
            </div>
          </Card>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 mt-10">
        Dashboard UMD — Conectado a MongoDB Atlas y Render ⚙️
      </footer>
    </div>
  );
}

// ==== COMPONENTES AUXILIARES ====
function KPI({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Card({ title, w, children }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg ${w}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
