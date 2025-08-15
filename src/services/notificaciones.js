// services/requests/categories.js
import { fetchData } from "@/services/api.js";

// Obtener todas las categorías
export const getAllNotifications = async () => {
  return fetchData("GET", "/notificaciones/");
};

// Crear una nueva categoría (con soporte para FormData)
export const createOneNotification = async (formData) => {
  return fetchData("POST", "/notificaciones/", formData, null, false); // El último parámetro indica que es FormData
};

// Actualizar categoría
export const updateNotification = async (id, formData) => {
  return fetchData("PUT", `/notificaciones/${id}/`, formData, null, true);
};
// Eliminar una categoría
export const deleteNotification = async (id) => {
  return fetchData("DELETE", `/notificaciones/${id}/`);
};

// Obtener una categoría por su ID
export const getNotificationById = async (id) => {
  return fetchData("GET", `/notificaciones/${id}/`);
};