import { useState, useRef, useEffect } from "react";
import {
  createOneQuestion,
  updateQuestion,
  getQuestionById,
} from "@/services/preguntas";
import { showAlert } from "./alerts";

export default function PreguntaForm({ editingId, fetchPreguntas, resetForm }) {
  const [formData, setFormData] = useState({
    pregunta: "",
    respuesta: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadPreguntasData = async () => {
        try {
          const res = await getQuestionById(editingId);
          setFormData({
            pregunta: res.data?.pregunta || res.pregunta,
            respuesta: res.data?.respuesta || res.respuesta,
          });
        } catch (error) {
          showAlert("error", "Error al cargar la pregunta");
          console.error(error);
        }
      };
      loadPreguntasData();
    }
  }, [editingId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("pregunta", formData.pregunta);
      formDataToSend.append("respuesta", formData.respuesta);

      if (editingId) {
        await updateQuestion(editingId, formDataToSend);
        showAlert("success", "Pregunta actualizada con éxito");
      } else {
        await createOneQuestion(formDataToSend);
        showAlert("success", "Pregunta creada con éxito");
      }

      resetForm();
      fetchPreguntas();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la pregunta";
      showAlert("error", errorMsg);
      console.error(error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div
        className="modal-content"
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "8px",
        }}
      >
        <div className="card mb-4 form-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {editingId ? "Editar Pregunta" : "Crear Nueva Pregunta"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetForm}
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-12 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Pregunta</label>
                  <input
                    type="text"
                    name="pregunta"
                    className="form-control"
                    value={formData.pregunta}
                    onChange={handleInputChange}
                    required
                    placeholder="¿....?"
                  />
                </div>
                <div className="col-12 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Respuesta</label>
                  <textarea
                    name="respuesta"
                    className="form-control"
                    value={formData.respuesta}
                    onChange={handleInputChange}
                    required
                    placeholder="la respuesta.."
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn bg-lunalu">
                  {editingId ? "Guardar Cambios" : "Crear Pregunta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
