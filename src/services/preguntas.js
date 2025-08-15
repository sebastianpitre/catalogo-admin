// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllQuestions = async () => {
  return fetchData("GET", "/preguntas/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneQuestion = async (formData) => {
  return fetchData("POST", "/preguntas/", formData, null, false); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateQuestion = async (id, formData) => {
  return fetchData("PUT", `/preguntas/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteQuestion = async (id) => {
  return fetchData("DELETE", `/preguntas/${id}/`);
};

// Obtener una categoría por su ID
export const getQuestionById = async (id) => {
  return fetchData("GET", `/preguntas/${id}/`);
};