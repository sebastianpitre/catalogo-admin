// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllGroups = async () => {
  return fetchData("GET", "/v1/groups/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneGroup = async (formData) => {
  return fetchData("POST", "/v1/groups/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateGroup = async (id, formData) => {
  return fetchData("PUT", `/v1/groups/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteGroup = async (id) => {
  return fetchData("DELETE", `/v1/groups/${id}/`);
};


// Obtener una categoría por su ID
export const getGroupById = async (id) => {
  return fetchData("GET", `/v1/groups/${id}/`);
};