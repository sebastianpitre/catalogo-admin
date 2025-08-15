// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllPermissions = async () => {
  return fetchData("GET", "/v1/permissions/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOnePermission = async (formData) => {
  return fetchData("POST", "/v1/permissions/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updatePermission = async (id, formData) => {
  return fetchData("PUT", `/v1/permissions/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deletePermission = async (id) => {
  return fetchData("DELETE", `/v1/permissions/${id}/`);
};

// Obtener una categoría por su ID
export const getPermissionById = async (id) => {
  return fetchData("GET", `/v1/permissions/${id}/`);
};