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
  const [tab, setTab] = useState("contratos");
  const [contratos, setContratos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [vendedorSel, setVendedorSel] = useState(null);
  const [vendedorData, setVendedorData] = useState(null);

  useEffect(() => {
    axios.get("https://dashboardumd.onrender.com/api/contratos").then((res) => {
      setContratos(res.data);
      const nombres = [...new Set(res.data.map((c) => c.Contrato?.Vendedor))];
      setVendedores(nombres);
    });
  }, []);

  // Cargar análisis general
  useEffect(() => {
    axios.get("https://dashboardumd.onrender.com/api/analisis/servicios").then((res) => setServicios(res.data));
    axios.get("https://dashboardumd.onrender.com/api/analisis/clientes").then((res) => setClientes(res.data));
  }, []);

  // Consultar vendedor específico
  useEffect(() => {
    if (vendedorSel) {
      axios
        .get(`https://dashboardumd.onrender.com/api/analisis/vendedor/${vendedorSel}`)
        .then((res) => setVendedorData(res.data));
    }
  }, [vendedorSel]);

  // === Datos procesados ===
  const contratosData = contratos.map((c) => ({
    id: c._id,
    cliente: c.Contrato?.Cliente || "—",
    estado: c.Contrato?.EstadoContrato || "—",
    valor: c.Contrato?.ValorTotal || 0,
    vendedor: c.Contrato?.Vendedor || "—",
    fechaInicio: c.Contrato?.FechaInicio || null,
    fechaFin: c.Contrato?.FechaFin || null,
  }));

  const totalContratos = contratosData.length;
  const contratosActivos = contratosData.filter((c) => c.estado === "Activo").length;
  const contratosFinalizados = contratosData.filter((c) => c.estado === "Finalizado").length;
  const valorTotal = contratosData.reduce((acc, c) => acc + (c.valor || 0), 0);

  // === Datos para gráficos ===
  const barData = {
    labels: contratosData.map((c) => c.cliente),
    datasets: [
      {
        label: "Valor del contrato ($)",
        data: contratosData.map((c) => c.valor),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Activos", "Finalizados"],
    datasets: [
      {
        data: [contratosActivos, contratosFinalizados],
        backgroundColor: ["#2563eb", "#9ca3af"],
      },
    ],
  };

  const serviciosData = {
    labels: servicios.map((s) => s.servicio),
    datasets: [
      {
        label: "Cantidad contratada",
        data: servicios.map((s) => s.cantidad),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
      },
    ],
  };

  const clientesData = {
    labels: clientes.map((c) => c.cliente),
    datasets: [
      {
        data: clientes.map((c) => c.contratos),
        backgroundColor: ["#3b82f6", "#22c55e", "#facc15", "#ef4444", "#8b5cf6"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard UNIMINUTO</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {["contratos", "analisis"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold shadow-md transition ${
              tab === t ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"
            }`}
          >
            {t === "contratos" ? "Contratos" : "Análisis"}
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
        </>
      )}

      {/* === Sección Análisis === */}
      {tab === "analisis" && (
        <>
          <div className="flex flex-col lg:flex-row justify-center gap-10 mb-12">
            <Card title="Servicios más contratados" w="w-[90%] lg:w-[45%]">
              <Bar data={serviciosData} />
            </Card>

            <Card title="Clientes con más contratos" w="w-[90%] lg:w-[35%]">
              <Pie data={clientesData} />
            </Card>
          </div>

          <Card title="Consulta por vendedor" w="w-[90%] lg:w-[50%] mx-auto text-center">
            <select
              className="border rounded-lg px-4 py-2 mb-4"
              value={vendedorSel || ""}
              onChange={(e) => setVendedorSel(e.target.value)}
            >
              <option value="">Seleccionar vendedor</option>
              {vendedores.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            {vendedorData && (
              <div className="text-sm text-gray-700 mt-2">
                <p>Contratos: {vendedorData.totalContratos}</p>
                <p>Valor total: ${vendedorData.valorTotal.toLocaleString()}</p>
              </div>
            )}
          </Card>
        </>
      )}
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
