import { useState, useEffect, useContext } from "react";
import {
  getGarmentById,
  addGarmentDescription,
  addGarmentColor,
  addGarmentSize,
  addSizesByColors,
  getAllSizesByColors,
  deleteSizesByColors,
  uploadMultipleGarmentImages,
  deleteGarmentDescription,
  deleteGarmentColor,
  deleteGarmentSize,
  deleteGarmentImage,
  patchGarmentColor,
  patchGarmentSize,
} from "@/services/prendas";

import { getAllSizes } from "@/services/tallas";
import { getAllColors } from "@/services/colores";
import { getAllDescriptions } from "@/services/descripcion";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function usePrendaData(prendaId) {
  const { user } = useContext(AuthContext);
  const [prendaData, setPrendaData] = useState(null);
  const [options, setOptions] = useState({
    descripciones: [],
    colores: [],
    tallas: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prendaRes] = await Promise.all([getGarmentById(prendaId)]);

      const [desc, col, tall, combinaciones] = await Promise.all([
        hasPermission(user, "view_descripcionprenda")
          ? getAllDescriptions()
          : [],
        hasPermission(user, "view_prendacolor") ? getAllColors() : [],
        hasPermission(user, "view_prendatalla") ? getAllSizes() : [],
        hasPermission(user, "view_prendatallacolor")
          ? getAllSizesByColors()
          : [],
      ]);

      const coloresArray = Array.isArray(col) ? col : col?.data || [];
      const tallasArray = Array.isArray(tall) ? tall : tall?.data || [];

      const getTallaById = (id) =>
        tallasArray.find((t) => t.id === parseInt(id));
      const getColorById = (id) =>
        coloresArray.find((c) => c.id === parseInt(id));

      const combinacionesFiltradas = (combinaciones || []).filter(
        (c) => c.prenda === parseInt(prendaId)
      );

      const agrupadasPorTalla = {};

      combinacionesFiltradas.forEach((combo) => {
        const tallaId = combo.talla?.id || combo.talla;
        const colorId = combo.color?.id || combo.color;

        const tallaCompleta = getTallaById(tallaId);
        const colorCompleto = getColorById(colorId);

        if (!agrupadasPorTalla[tallaId]) {
          agrupadasPorTalla[tallaId] = {
            talla: {
              id: tallaId,
              nombre: tallaCompleta?.nombre || "Talla desconocida",
            },
            colores: [],
          };
        }

        agrupadasPorTalla[tallaId].colores.push({
          id: colorId,
          nombre: colorCompleto?.nombre || "Color desconocido",
          asignacionId: combo.id,
        });
      });

      const combinacionesAgrupadas = Object.values(agrupadasPorTalla);

      setPrendaData({
        ...prendaRes,
        color_por_talla: hasPermission(user, "view_prendatallacolor")
          ? combinacionesAgrupadas
          : [],
      });

      setOptions({
        descripciones: Array.isArray(desc) ? desc : desc?.data || [],
        colores: coloresArray,
        tallas: tallasArray,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [prendaId]);

  const getRelationId = (type, item) => {
    switch (type) {
      case "descripciones":
        return (
          item.id ||
          prendaData.descripciones?.find(
            (d) =>
              d.descripcion.id === item.descripcion?.id ||
              d.descripcion.id === item.id
          )?.id
        );
      case "colores":
        return (
          item.id ||
          prendaData.colores?.find(
            (c) => c.color.id === item.color?.id || c.color.id === item.id
          )?.id
        );
      case "tallas":
        return prendaData.tallas?.find(
          (t) => t.talla.id === item.talla?.id || t.talla.id === item.id
        )?.id;
      default:
        return item.id;
    }
  };

  const handleToggleColorAvailability = async (colorAssignment) => {
    try {
      const newAvailability = !colorAssignment.disponible;
      await patchGarmentColor(colorAssignment.id, {
        disponible: newAvailability,
      });
      await loadData();
    } catch (error) {
      console.error("Error al cambiar disponibilidad del color:", error);
      throw error;
    }
  };

  const handleToggleSizeAvailability = async (sizeAssignment) => {
    try {
      const newAvailability = !sizeAssignment.disponible;
      await patchGarmentSize(sizeAssignment.id, {
        disponible: newAvailability,
      });
      await loadData();
    } catch (error) {
      console.error("Error al cambiar disponibilidad de talla:", error);
      throw error;
    }
  };

  const handleAddDescription = async (descripcionId) => {
    try {
      const formData = new FormData();
      formData.append("prenda_id", prendaId);
      formData.append("descripcion_id", descripcionId);
      await addGarmentDescription(formData);
      await loadData();
    } catch (error) {
      console.error("Error al añadir descripción:", error);
      throw error;
    }
  };

  const handleAddAsignacion = async ({ tallaId, colorIds }) => {
    try {
      for (const colorId of colorIds) {
        const payload = {
          prenda: parseInt(prendaId),
          talla: parseInt(tallaId),
          color: parseInt(colorId),
        };
        await addSizesByColors(payload);
      }
      await loadData();
    } catch (error) {
      console.error("Error asignando colores a talla:", error);
      throw error;
    }
  };

  const handleDeleteAsignacion = async (asignacionId) => {
    try {
      await deleteSizesByColors(asignacionId);
      await loadData();
    } catch (error) {
      console.error("Error al eliminar combinación talla-color:", error);
      throw error;
    }
  };

  const handleDeleteItem = async (type, item) => {
    const relationId = getRelationId(type, item);
    if (!relationId) throw new Error("No se encontró la relación");

    try {
      switch (type) {
        case "colores":
          await deleteGarmentColor(relationId);
          break;
        case "tallas":
          await deleteGarmentSize(relationId);
          break;
        case "descripciones":
          await deleteGarmentDescription(relationId);
          break;
      }
      await loadData();
    } catch (error) {
      await loadData();
      throw error;
    }
  };

  const handleAddColor = async (colorId) => {
    try {
      const formData = new FormData();
      formData.append("prenda_id", prendaId);
      formData.append("color_id", colorId);
      formData.append("disponible", "true");
      await addGarmentColor(formData);
      await loadData();
    } catch (error) {
      throw error;
    }
  };

  const handleAddSize = async (sizeId) => {
    try {
      const formData = new FormData();
      formData.append("prenda_id", prendaId);
      formData.append("talla_id", sizeId);
      formData.append("disponible", "true");
      await addGarmentSize(formData);
      await loadData();
    } catch (error) {
      console.error("Error al añadir talla:", error);
      throw error;
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      await deleteGarmentImage(image.id);
      await loadData();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      throw error;
    }
  };

  const handleImageUpload = async (formData) => {
    try {
      await uploadMultipleGarmentImages(formData);
      await loadData();
    } catch (error) {
      console.error("Error al subir imágenes múltiples:", error);
      throw error;
    }
  };

  return {
    prendaData,
    options,
    loading,
    handleAddDescription,
    handleAddColor,
    handleAddSize,
    handleDeleteItem,
    handleAddAsignacion,
    handleToggleColorAvailability,
    handleToggleSizeAvailability,
    handleDeleteImage,
    handleDeleteAsignacion,
    handleImageUpload,
    refreshData: loadData,
  };
}
