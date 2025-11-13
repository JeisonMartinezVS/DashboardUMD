import React, { useEffect, useState } from "react";
import { getContratos, getServicios } from "./api.js";
import ChartCard from "./components/ChartCard.jsx";

export default function App() {
  const [contratos, setContratos] = useState([]);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    getContratos().then((res) => setContratos(res.data));
    getServicios().then((res) => setServicios(res.data));
  }, []);

  const contratosPorCliente = contratos.map((c) => ({
    cliente: c.Contrato.Cliente,
    valor: c.Contrato.ValorTotal,
  }));

  const serviciosPorTipo = servicios.map((s) => ({
    tipo: s.Servicio.TipoServicio,
    precio: s.Servicio.Precio,
  }));

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>📊 Dashboard SoftUMD</h1>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        <ChartCard
          title="Valor por Cliente"
          labels={contratosPorCliente.map((c) => c.cliente)}
          data={contratosPorCliente.map((c) => c.valor)}
        />
        <ChartCard
          title="Precios por Tipo de Servicio"
          type="pie"
          labels={serviciosPorTipo.map((s) => s.tipo)}
          data={serviciosPorTipo.map((s) => s.precio)}
        />
      </div>
    </div>
  );
}
