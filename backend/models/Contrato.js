import mongoose from "mongoose";

const ContratoSchema = new mongoose.Schema({
  Contrato: {
    IdContrato: Number,
    Fecha: String,
    FechaInicio: String,
    FechaFin: String,
    Cliente: String,
    Vendedor: String,
    EstadoContrato: String,
    ValorTotal: Number,
    Observaciones: String,
    Detalles: [
      {
        Servicio: String,
        Cantidad: Number,
        Precio: Number,
        Subtotal: Number,
      },
    ],
  },
});

export default mongoose.model("Contrato", ContratoSchema, "Contrato");
