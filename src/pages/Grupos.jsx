import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllGroups } from "../services/grupos";
import { getAllPermissions } from "../services/permisos";
import { ToastContainer } from "react-toastify";
import GruposHeader from "../components/grupos/GruposHeader";
import GruposForm from "../components/grupos/GruposForm";
import GruposList from "../components/grupos/GruposList";
import { showAlert } from "../components/grupos/alerts";
import "../components/colores/styles.css";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchGrupos();
    fetchPermisos();
  }, []);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const response = await getAllGroups();

      let gruposData = [];
      if (Array.isArray(response)) {
        gruposData = response;
      } else if (Array.isArray(response.data)) {
        gruposData = response.data;
      } else if (Array.isArray(response.result)) {
        gruposData = response.result;
      }

      setGrupos(gruposData);
    } catch (error) {
      showAlert("error", "Error al cargar los grupos");
      console.error("Error detallado:", error);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchPermisos = async () => {
    try {
      const res = await getAllPermissions();

      const permisosData = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.result)
        ? res.result
        : [];

      console.log("✅ Permisos cargados en Grupos:", permisosData);
      setPermisos(permisosData);
    } catch (error) {
      showAlert("error", "Error al cargar los permisos");
      console.error("❌ Error al cargar permisos:", error);
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

      <GruposHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && permisos.length > 0 && (
        <GruposForm
          editingId={editingId}
          fetchGrupos={fetchGrupos}
          resetForm={resetForm}
          permisos={permisos}
        />
      )}

      <GruposList
        loading={loading}
        grupos={grupos}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchGrupos={fetchGrupos}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
