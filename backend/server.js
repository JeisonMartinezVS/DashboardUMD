import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Cliente from "./models/Clientes.js";
import Contrato from "./models/Contrato.js";
import Geografia from "./models/Geografia.js";
import Organizacion from "./models/Organizacion.js";
import Servicio from "./models/Servicio.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error conectando MongoDB:", err));

// 🔹 Rutas por colección
app.get("/api/clientes", async (_, res) => res.json(await Cliente.find()));
app.get("/api/contratos", async (_, res) => res.json(await Contrato.find()));
app.get("/api/geografia", async (_, res) => res.json(await Geografia.find()));
app.get("/api/organizacion", async (_, res) => res.json(await Organizacion.find()));
app.get("/api/servicios", async (_, res) => res.json(await Servicio.find()));

app.get("/api/analisis/servicios", async (req, res) => {
  try {
    const contratos = await Contrato.find();
    const servicioStats = {};

    contratos.forEach((c) => {
      c.Contrato.Detalles.forEach((d) => {
        const nombre = d.Servicio;
        if (!servicioStats[nombre]) servicioStats[nombre] = 0;
        servicioStats[nombre] += d.Cantidad;
      });
    });

    res.json(
      Object.entries(servicioStats).map(([servicio, cantidad]) => ({
        servicio,
        cantidad,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Error al obtener servicios" });
  }
});

// 2️⃣ Clientes con más contratos
app.get("/api/analisis/clientes", async (req, res) => {
  try {
    const contratos = await Contrato.find();
    const clienteStats = {};

    contratos.forEach((c) => {
      const cliente = c.Contrato.Cliente;
      if (!clienteStats[cliente]) clienteStats[cliente] = 0;
      clienteStats[cliente]++;
    });

    res.json(
      Object.entries(clienteStats).map(([cliente, contratos]) => ({
        cliente,
        contratos,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// 3️⃣ Consultar contratos por vendedor
app.get("/api/analisis/vendedor/:nombre", async (req, res) => {
  try {
    const vendedor = req.params.nombre;
    const contratos = await Contrato.find({ "Contrato.Vendedor": vendedor });

    const totalValor = contratos.reduce(
      (sum, c) => sum + (c.Contrato.ValorTotal || 0),
      0
    );

    res.json({
      vendedor,
      totalContratos: contratos.length,
      valorTotal: totalValor,
      contratos,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos del vendedor" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));
