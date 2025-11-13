import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
    Clientes: {
    NombreCliente: String,
    TipoDocumento: String,
    NumeroDocumento: String,
    TipoCliente: String,
    Ciudad: String,
    Email: String,
    Telefono: String,
    Direccion: String,
}
});

export default mongoose.model("Cliente", ClienteSchema, "Cliente");
