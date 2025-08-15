// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllSizes = async () => {
  return fetchData("GET", "/tallas/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneSize = async (formData) => {
  return fetchData("POST", "/tallas/", formData, null, false); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateSize = async (id, formData) => {
  return fetchData("PUT", `/tallas/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteSize = async (id) => {
  return fetchData("DELETE", `/tallas/${id}/`);
};

// Obtener una categoría por su ID
export const getSizeById = async (id) => {
  return fetchData("GET", `/tallas/${id}/`);
};