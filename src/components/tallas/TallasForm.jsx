import { useState, useRef, useEffect } from "react";
import { createOneSize, updateSize, getSizeById } from "@/services/tallas";
import { showAlert } from "./alerts";

export default function TallasForm({ editingId, fetchTallas, resetForm }) {
  const [formData, setFormData] = useState({
    nombre: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadTallasData = async () => {
        try {
          const res = await getSizeById(editingId);
          setFormData({
            nombre: res.data?.nombre || res.nombre,
          });
        } catch (error) {
          showAlert("error", "Error al cargar la talla");
          console.error(error);
        }
      };
      loadTallasData();
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
      formDataToSend.append("nombre", formData.nombre);

      if (editingId) {
        await updateSize(editingId, formDataToSend);
        showAlert("success", "Talla actualizada con éxito");
      } else {
        await createOneSize(formDataToSend);
        showAlert("success", "Talla creada con éxito");
      }

      resetForm();
      fetchTallas();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la Talla";
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
        overflowY: 'auto',
        padding: '20px'
      }}>
      <div className="modal-content" 
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '95vh',
          overflowY: 'auto',
          borderRadius: '8px'
        }}>
          
        <div className="card mb-4 form-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {editingId ? "Editar Talla" : "Crear Nueva Talla"}
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
                <div className="col-md-12 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Oversize"
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
                  {editingId ? "Guardar Cambios" : "Crear Talla"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}
