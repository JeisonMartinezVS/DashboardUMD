import mongoose from "mongoose";

const ServicioSchema = new mongoose.Schema({
  Servicio: {
    NombreServicio: String,
    Descripcion: String,
    Precio: Number,
    TipoServicio: String,
    Activo: Number,
  },
});

export default mongoose.model("Servicio", ServicioSchema);
