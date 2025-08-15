// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllUsers = async () => {
  return fetchData("GET", "/v1/users/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneUser = async (formData) => {
  return fetchData("POST", "/v1/users/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateUser = async (id, formData) => {
  return fetchData("PUT", `/v1/users/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteUser = async (id) => {
  return fetchData("DELETE", `/v1/users/${id}/`);
};


// Obtener una categoría por su ID
export const getUserById = async (id) => {
  return fetchData("GET", `/v1/users/${id}/`);
};