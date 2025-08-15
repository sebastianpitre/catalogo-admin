// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllItems = async () => {
  return fetchData("GET", "/dashboard/totales/");
};