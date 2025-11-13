import axios from "axios";

const API_BASE = "https://dashboardumd.onrender.com/api";

export const getClientes = () => axios.get(`${API_BASE}/clientes`);
export const getContratos = () => axios.get(`${API_BASE}/contratos`);
export const getServicios = () => axios.get(`${API_BASE}/servicios`);
