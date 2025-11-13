import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
    Cliente: {
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

export default mongoose.model("Clientes", ClienteSchema, "Clientes");
