// backend/models/Sale.js
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  month: String,
});

export default mongoose.model("Sale", SaleSchema);
