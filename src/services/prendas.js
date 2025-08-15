// services/prendas.js

import { fetchData } from "@/services/api.js";

// Obtener todas las prendas
export const getAllGarments = async () => {
  return fetchData("GET", "/prendas/");
};

// Crear una nueva prenda (con soporte para FormData)
export const createOneGarment = async (formData) => {
  return fetchData("POST", "/prendas/", formData, null, false); // El último parámetro indica que es FormData
};
// Actualizar prenda
export const updateGarment = async (id, formData) => {
  return fetchData("PUT", `/prendas/${id}/`, formData, null, true);
};
// Eliminar una prenda
export const deleteGarment = async (id) => {
  return fetchData("DELETE", `/prendas/${id}/`);
};

// Obtener una prenda por su ID
export const getGarmentById = async (id) => {
  return fetchData("GET", `/prendas/${id}/`);
};


//  DESCRIPCIONES POR PRENDA

// añadir una descripcion a una prenda
export const addGarmentDescription = async ( formData) => {
  return fetchData("POST",`/descripciones-prenda/`, formData,null,false);
};

// Actualizar una descripcion de una prenda
export const updateGarmentDescription = async (id, formData) => {
  return fetchData("PUT", `/descripciones-prenda/${id}/`, formData, null, false);
};

// Eliminar una descripcion de una prenda
export const deleteGarmentDescription = async (id) => {
  return fetchData("DELETE", `/descripciones-prenda/${id}/`);
};

// Obtener una descripcion de una prenda por su ID
export const getGarmentDescriptionById = async (id) => {
  return fetchData("GET", `/descripciones-prenda/${id}/`);
};


// COLORES POR PRENDA

// añadir colores a una prenda
export const addGarmentColor = async ( formData) => {
  return fetchData("POST",`/colores-prenda/`, formData,null,false);
};

// Actualizar un color de una prenda
export const updateGarmentColor = async (id, formData) => {
  return fetchData("PUT", `/colores-prenda/${id}/`, formData, null, false);
};

export const patchGarmentColor = async (id, data) => {
  return fetchData("PATCH", `/colores-prenda/${id}/`, data, null, false);
};

// Eliminar un color de una prenda
export const deleteGarmentColor = async (id) => {
  return fetchData("DELETE", `/colores-prenda/${id}/`);
};

// Obtener un color de una prenda por su ID
export const getGarmentColorById = async (id) => {
  return fetchData("GET", `/colores-prenda/${id}/`);
};


// TALLAS POR PRENDA 

// Añadir tallas de prenda
export const addGarmentSize = async ( formData) => {
  return fetchData("POST",`/tallas-prenda/`, formData,null,false);
};

// Actualizar una talla de una prenda
export const updateGarmentSize = async (id, formData) => {
  return fetchData("PUT", `/tallas-prenda/${id}/`, formData, null, false);
};

export const patchGarmentSize = async (id, data) => {
  return fetchData("PATCH", `/tallas-prenda/${id}/`, data, null, false);
};

// Eliminar una talla de una prenda
export const deleteGarmentSize = async (id) => {
  return fetchData("DELETE", `/tallas-prenda/${id}/`);
};

// Obtener una talla de una prenda por su ID
export const getGarmentSizeById = async (id) => {
  return fetchData("GET", `/tallas-prenda/${id}/`);
};



// IMAGEN POR PRENDA

// añadir imagen a una prenda
export const uploadGarmentImage = async ( formData) => {
  return fetchData("POST",`/imagenes-prenda/`, formData,null,true);
};

export const uploadMultipleGarmentImages = async (formData) => {
  return fetchData("POST", `/imagenes-prenda/upload_multiple/`, formData, null, true);
};

// Actualizar una imagen de una prenda
export const updateGarmentImage = async (id, formData) => {
  return fetchData("PUT", `/imagenes-prenda/${id}/`, formData, null, false);
};

// Eliminar una imagen de una prenda
export const deleteGarmentImage = async (id) => {
  return fetchData("DELETE", `/imagenes-prenda/${id}/`);
};

// Obtener una imagen de una prenda por su ID
export const getGarmentImageById = async (id) => {
  return fetchData("GET", `/imagenes-prenda/${id}/`);
};


// PRENDA TALLA COLOR

// Obtener todas las tallas por colores

// Obtener todas las prendas
export const getAllSizesByColors = async () => {
  return fetchData("GET", "/prenda-talla-color/");
};

// añadir imagen a una prenda
export const addSizesByColors = async ( formData) => {
  return fetchData("POST",`/prenda-talla-color/`, formData,null,false);
};

// Actualizar una imagen de una prenda
export const updateSizesByColors = async (id, formData) => {
  return fetchData("PUT", `/prenda-talla-color/${id}/`, formData, null, false);
};

// Eliminar una imagen de una prenda
export const deleteSizesByColors = async (id) => {
  return fetchData("DELETE", `/prenda-talla-color/${id}/`);
};

// Obtener una imagen de una prenda por su ID
export const getSizesByColorsById = async (id) => {
  return fetchData("GET", `/prenda-talla-color//${id}/`);
};