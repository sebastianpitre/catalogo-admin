import { useState, useEffect } from "react";
import { getAllColors } from "../services/colores";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ColoresHeader from "../components/colores/ColoresHeader";
import ColoresForm from "../components/colores/ColoresForm";
import ColoresList from "../components/colores/ColoresList";
import { showAlert } from "../components/colores/alerts";
import "../components/colores/styles.css";

export default function Coloress() {
  const [colores, setColores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchColores();
  }, []);

  const fetchColores = async () => {
    try {
      setLoading(true);
      const response = await getAllColors();

      let coloresData = [];
      if (Array.isArray(response)) {
        coloresData = response;
      } else if (Array.isArray(response.data)) {
        ccoloresData = response.data;
      } else if (Array.isArray(response.result)) {
        coloresData = response.result;
      }

      setColores(coloresData);
    } catch (error) {
      showAlert("error", "Error al cargar las colores");
      console.error("Error detallado:", error);
      setColores([]);
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

      <ColoresHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <ColoresForm
          editingId={editingId}
          fetchColores={fetchColores}
          resetForm={resetForm}
        />
      )}

      <ColoresList
        loading={loading}
        colores={colores}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchColores={fetchColores}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
