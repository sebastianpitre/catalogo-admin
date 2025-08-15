import { useState, useRef, useEffect } from "react";
import {
  createOneNotification,
  updateNotification,
  getNotificationById,
} from "@/services/notificaciones";
import { showAlert } from "./alerts";

export default function NotificacionForm({
  editingId,
  fetchNotificaciones,
  resetForm,
}) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadNotificacionesData = async () => {
        try {
          const res = await getNotificationById(editingId);
          setFormData({
            titulo: res.data?.titulo || res.titulo,
            descripcion: res.data?.descripcion || res.descripcion,
          });
        } catch (error) {
          showAlert("error", "Error al cargar la notificación");
          console.error(error);
        }
      };
      loadNotificacionesData();
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
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);

      if (editingId) {
        await updateNotification(editingId, formDataToSend);
        showAlert("success", "Notificación actualizada con éxito");
      } else {
        await createOneNotification(formDataToSend);
        showAlert("success", "Notificación creada con éxito");
      }

      resetForm();
      fetchNotificaciones();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la Notificación";
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
            {editingId ? "Editar Notificación" : "Crear Nueva Notificación"}
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
                <label className="form-label fw-bold">Título</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Oferta !!"
                />
              </div>
              <div className="col-12 mb-3 mt-2 mb-md-0">
                <label className="form-label fw-bold">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: nueva oferta de ..."
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
                {editingId ? "Guardar Cambios" : "Crear Notificación"}
              </button>
            </div>
          </form>
        </div>
      </div>

      </div>
    </div>

    
  );
}
