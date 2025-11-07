import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const ventaSchema = new mongoose.Schema({
  fecha: String,
  producto: String,
  categoria: String,
  precio: Number,
  cantidad: Number,
  total: Number,
  region: String,
});
const Venta = mongoose.model("Venta", ventaSchema);

const sample = [
  {"fecha":"2025-11-01","producto":"Laptop Dell XPS","categoria":"Tecnología","precio":1500,"cantidad":3,"total":4500,"region":"Lima"},
  {"fecha":"2025-11-01","producto":"Auriculares Sony","categoria":"Audio","precio":300,"cantidad":5,"total":1500,"region":"Bogotá"},
  {"fecha":"2025-11-02","producto":"Smartphone Samsung","categoria":"Telefonía","precio":1200,"cantidad":2,"total":2400,"region":"Quito"},
  {"fecha":"2025-11-02","producto":"Tablet iPad Pro","categoria":"Tecnología","precio":1100,"cantidad":4,"total":4400,"region":"Lima"},
  {"fecha":"2025-11-03","producto":"Teclado Mecánico","categoria":"Periféricos","precio":80,"cantidad":6,"total":480,"region":"Buenos Aires"},
  {"fecha":"2025-11-03","producto":"Monitor LG","categoria":"Monitores","precio":300,"cantidad":2,"total":600,"region":"Lima"},
  {"fecha":"2025-11-04","producto":"Mouse Logitech","categoria":"Periféricos","precio":40,"cantidad":10,"total":400,"region":"Bogotá"}
];

async function run(){
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Conectado para seed");
  await Venta.deleteMany({});
  await Venta.insertMany(sample);
  console.log("Datos insertados");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
