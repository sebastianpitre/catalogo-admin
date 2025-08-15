import { useState, useEffect } from "react";
import { getAllUsers } from "../services/usuarios";
import { getAllPermissions } from "../services/permisos";
import { getAllGroups } from "../services/grupos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsuariosHeader from "../components/usuarios/UsuariosHeader";
import UsuariosForm from "../components/usuarios/UsuariosForm";
import UsuariosList from "../components/usuarios/UsuariosList";
import { showAlert } from "../components/usuarios/alerts";
import "../components/colores/styles.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchPermisos();
    fetchGrupos();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();

      let usuariosData = [];
      if (Array.isArray(response)) {
        usuariosData = response;
      } else if (Array.isArray(response.data)) {
        usuariosData = response.data;
      } else if (Array.isArray(response.result)) {
        usuariosData = response.result;
      }

      setUsuarios(usuariosData);
    } catch (error) {
      showAlert("error", "Error al cargar los usuarios");
      console.error("Error detallado:", error);
      setUsuarios([]);
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

  const fetchGrupos = async () => {
    try {
      const res = await getAllGroups();

      const gruposData = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.result)
        ? res.result
        : [];

      console.log("✅ Grupos cargados:", gruposData);
      setGrupos(gruposData);
    } catch (error) {
      showAlert("error", "Error al cargar los grupos");
      console.error("❌ Error al cargar grupos:", error);
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

      <UsuariosHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <UsuariosForm
          editingId={editingId}
          fetchUsuarios={fetchUsuarios}
          resetForm={resetForm}
          permisos={permisos}
          grupos={grupos}
        />
      )}

      <UsuariosList
        loading={loading}
        usuarios={usuarios}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchUsuarios={fetchUsuarios}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
