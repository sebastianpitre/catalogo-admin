import { useState, useEffect } from "react";
import { getAllPermissions } from "../services/permisos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PermisosHeader from "../components/permisos/PermisosHeader";
import PermisosList from "../components/permisos/PermisosList";
import { showAlert } from "../components/usuarios/alerts";
import "../components/colores/styles.css";

export default function Permisos() {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchPermisos();
  }, []);

  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const response = await getAllPermissions();

      let permisosData = [];
      if (Array.isArray(response)) {
        permisosData = response;
      } else if (Array.isArray(response.data)) {
        permisosData = response.data;
      } else if (Array.isArray(response.result)) {
        permisosData = response.result;
      }

      setPermisos(permisosData);
    } catch (error) {
      showAlert("error", "Error al cargar los permisos");
      console.error("Error detallado:", error);
      setPermisos([]);
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

      <PermisosHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      <PermisosList
        loading={loading}
        permisos={permisos}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchPermisos={fetchPermisos}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
