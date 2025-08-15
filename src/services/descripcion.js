// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllDescriptions = async () => {
  return fetchData("GET", "/descripciones/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneDescription = async (formData) => {
  return fetchData("POST", "/descripciones/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateDescription = async (id, formData) => {
  return fetchData("PUT", `/descripciones/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteDescription = async (id) => {
  return fetchData("DELETE", `/descripciones/${id}/`);
};

// Obtener una categoría por su ID
export const getDescriptionById = async (id) => {
  return fetchData("GET", `/descripciones/${id}/`);
};