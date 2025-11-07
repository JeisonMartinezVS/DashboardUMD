import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
});

export const getVentas = () => API.get("/ventas");
export const getTotalesPorCategoria = () => API.get("/ventas/totales-por-categoria");
export const getTotalesPorRegion = () => API.get("/ventas/totales-por-region");
export const getTotalesPorDia = (from, to) =>
  API.get("/ventas/totales-por-dia", { params: { from, to } });
