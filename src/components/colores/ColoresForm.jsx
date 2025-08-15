import { useState, useRef, useEffect } from "react";
import { createOneColor, updateColor, getColorById } from "@/services/colores";
import { showAlert } from "./alerts";

export default function ColoresForm({ editingId, fetchColores, resetForm }) {
  const [formData, setFormData] = useState({
    nombre: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadColoresData = async () => {
        try {
          const res = await getColorById(editingId);
          setFormData({
            nombre: res.data?.nombre || res.nombre,
          });
        } catch (error) {
          showAlert("error", "Error al cargar el color");
          console.error(error);
        }
      };
      loadColoresData();
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
        await updateColor(editingId, formDataToSend);
        showAlert("success", "Color actualizado con éxito");
      } else {
        await createOneColor(formDataToSend);
        showAlert("success", "Color creado con éxito");
      }

      resetForm();
      fetchColores();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar el color";
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
                {editingId ? "Editar Color" : "Crear Nuevo Color"}
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
                    <label className="form-label fw-bold">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: Azul"
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
                    {editingId ? "Guardar Cambios" : "Crear Color"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
  );
}
