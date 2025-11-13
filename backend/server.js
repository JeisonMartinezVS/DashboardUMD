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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));
