import { useState, useEffect } from "react";
import { getAllDescriptions } from "../services/descripcion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DescripcionHeader from "../components/descripciones/DescripcionHeader";
import DescripcionForm from "../components/descripciones/DescripcionForm";
import DescripcionList from "../components/descripciones/DescripcionList";
import { showAlert } from "../components/descripciones/alerts";
import "../components/descripciones/styles.css";

export default function Descripciones() {
  const [descripciones, setDescripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchDescripciones();
  }, []);

  const fetchDescripciones = async () => {
    try {
      setLoading(true);
      const response = await getAllDescriptions();

      let descripcionesData = [];
      if (Array.isArray(response)) {
        descripcionesData = response;
      } else if (Array.isArray(response.data)) {
        descripcionesData = response.data;
      } else if (Array.isArray(response.result)) {
        descripcionesData = response.result;
      }

      setDescripciones(descripcionesData);
    } catch (error) {
      showAlert("error", "Error al cargar las descripciones");
      console.error("Error detallado:", error);
      setDescripciones([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="container-fluid py-4 Coloress-container">
      <ToastContainer
        toastClassName="custom-toast-container"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />

      <DescripcionHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <DescripcionForm
          editingId={editingId}
          fetchDescripciones={fetchDescripciones}
          resetForm={resetForm}
        />
      )}

      <DescripcionList
        loading={loading}
        descripciones={descripciones}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchDescripciones={fetchDescripciones}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
