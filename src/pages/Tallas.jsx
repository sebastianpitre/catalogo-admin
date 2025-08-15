import { useState, useEffect } from "react";
import { getAllSizes } from "../services/tallas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TallasHeader from "../components/tallas/TallasHeader";
import TallasForm from "../components/tallas/TallasForm";
import TallasList from "../components/tallas/TallasList";
import { showAlert } from "../components/tallas/alerts";
import "../components/descripciones/styles.css";

export default function Tallas() {
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchTallas();
  }, []);

  const fetchTallas = async () => {
    try {
      setLoading(true);
      const response = await getAllSizes();

      let tallasData = [];
      if (Array.isArray(response)) {
        tallasData = response;
      } else if (Array.isArray(response.data)) {
        tallasData = response.data;
      } else if (Array.isArray(response.result)) {
        tallasData = response.result;
      }

      setTallas(tallasData);
    } catch (error) {
      showAlert("error", "Error al cargar las tallas");
      console.error("Error detallado:", error);
      setTallas([]);
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

      <TallasHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <TallasForm
          editingId={editingId}
          fetchTallas={fetchTallas}
          resetForm={resetForm}
        />
      )}

      <TallasList
        loading={loading}
        tallas={tallas}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchTallas={fetchTallas}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
