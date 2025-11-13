import mongoose from "mongoose";

const OrganizacionSchema = new mongoose.Schema({
  Organizacion: {
    Empresa: String,
    Nit: String,
    DireccionEmpresa: String,
    Sede: String,
    DireccionSede: String,
    CiudadSede: String,
    Vendedor: String,
    CorreoVendedor: String,
    TelefonoVendedor: String,
  },
});

export default mongoose.model("Organizacion", OrganizacionSchema);
