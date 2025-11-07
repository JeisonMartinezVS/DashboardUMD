// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Sale from "./models/Sale.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas (reemplaza con tu conexión)
mongoose
  .connect("mongodb+srv://yeisonaml1117_db_user:31p1L1uKFVmpwW2P@dashboardumd.hpmmvdr.mongodb.net/")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error conectando MongoDB:", err));

// Ruta para insertar datos de prueba (ejecuta una sola vez)
app.get("/api/seed", async (req, res) => {
  await Sale.deleteMany({});
  await Sale.insertMany([
    { product: "Producto D", quantity: 50, month: "Abril" },
    { product: "Producto E", quantity: 10, month: "Mayo" },
  ]);
  res.send("Datos insertados 2");
});

// Ruta para obtener datos
app.get("/api/sales", async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor backend en http://localhost:${PORT}`));
