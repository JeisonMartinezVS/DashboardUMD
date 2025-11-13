import mongoose from "mongoose";

const GeografiaSchema = new mongoose.Schema({
  Geografia: {
    NombrePais: String,
    NombreDepartamento: String,
    NombreCiudad: String,
  },
});

export default mongoose.model("Geografia", GeografiaSchema, "Geografia");
