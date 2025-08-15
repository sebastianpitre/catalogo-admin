// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllColors = async () => {
  return fetchData("GET", "/colores/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneColor = async (formData) => {
  return fetchData("POST", "/colores/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateColor = async (id, formData) => {
  return fetchData("PUT", `/colores/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteColor = async (id) => {
  return fetchData("DELETE", `/colores/${id}/`);
};


// Obtener una categoría por su ID
export const getColorById = async (id) => {
  return fetchData("GET", `/colores/${id}/`);
};