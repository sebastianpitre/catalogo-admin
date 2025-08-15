import { useState, useEffect } from "react";
import { getAllQuestions } from "../services/preguntas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreguntaHeader from "../components/preguntas/PreguntaHeader";
import PreguntaForm from "../components/preguntas/PreguntaForm";
import PreguntaList from "../components/preguntas/PreguntaList";
import { showAlert } from "../components/preguntas/alerts";
import "../components/preguntas/styles.css";

export default function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const fetchPreguntas = async () => {
    try {
      setLoading(true);
      const response = await getAllQuestions();

      let preguntasData = [];
      if (Array.isArray(response)) {
        preguntasData = response;
      } else if (Array.isArray(response.data)) {
        preguntasData = response.data;
      } else if (Array.isArray(response.result)) {
        preguntasData = response.result;
      }

      setPreguntas(preguntasData);
    } catch (error) {
      showAlert("error", "Error al cargar las preguntas");
      console.error("Error detallado:", error);
      setPreguntas([]);
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

      <PreguntaHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <PreguntaForm
          editingId={editingId}
          fetchPreguntas={fetchPreguntas}
          resetForm={resetForm}
        />
      )}

      <PreguntaList
        loading={loading}
        preguntas={preguntas}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchPreguntas={fetchPreguntas}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
