// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllCategories = async () => {
  return fetchData("GET", "/categorias/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneCategory = async (formData) => {
  return fetchData("POST", "/categorias/", formData, null, true); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateCategory = async (id, formData) => {
  return fetchData("PUT", `/categorias/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteCategory = async (id) => {
  return fetchData("DELETE", `/categorias/${id}/`);
};


// Obtener una categoría por su ID
export const getCategoryById = async (id) => {
  return fetchData("GET", `/categorias/${id}/`);
};