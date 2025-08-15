import { useState, useEffect } from "react";
import { getAllNotifications } from "../services/notificaciones";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificacionHeader from "../components/notificaciones/NotificacionHeader";
import NotificacionForm from "../components/notificaciones/NotificacionForm";
import NotificacionList from "../components/notificaciones/NotificacionList";
import { showAlert } from "../components/notificaciones/alerts";
import "../components/descripciones/styles.css";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();

      let notificacionesData = [];
      if (Array.isArray(response)) {
        notificacionesData = response;
      } else if (Array.isArray(response.data)) {
        notificacionesData = response.data;
      } else if (Array.isArray(response.result)) {
        notificacionesData = response.result;
      }

      setNotificaciones(notificacionesData);
    } catch (error) {
      showAlert("error", "Error al cargar las notificaciones");
      console.error("Error detallado:", error);
      setNotificaciones([]);
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

      <NotificacionHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <NotificacionForm
          editingId={editingId}
          fetchNotificaciones={fetchNotificaciones}
          resetForm={resetForm}
        />
      )}

      <NotificacionList
        loading={loading}
        notificaciones={notificaciones}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchNotificaciones={fetchNotificaciones}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
