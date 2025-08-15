import { useState, useRef, useEffect } from "react";
import { createOnePermission, updatePermission, getPermissionById } from "@/services/permisos";
import { showAlert } from "./alerts";

export default function PermisosForm({ editingId, fetchUsuarios, resetForm }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    groups_ids: [],
    permission_ids: [],
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadUsersData = async () => {
        try {
          const res = await getUserById(editingId);
          setFormData({
            username: res.data?.username || res.username || "",
            email: res.data?.email || res.email || "",
            password: "", // Por seguridad no pongas nunca el password que venga del backend
            groups_ids: res.data?.groups_ids || res.groups_ids || [],
            permission_ids:
              res.data?.permission_ids || res.permission_ids || [],
          });
        } catch (error) {
          showAlert("error", "Error al cargar el usuario");
          console.error(error);
        }
      };
      loadUsersData();
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
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      (formData.permission_ids || []).forEach((id) => {
        formDataToSend.append("permission_ids", parseInt(id));
      });

      (formData.groups_ids || []).forEach((id) => {
        formDataToSend.append("groups_ids", parseInt(id));
      });

      if (editingId) {
        await updateUser(editingId, formDataToSend);
        showAlert("success", "Usuario actualizado con éxito");
      } else {
        await createOneUser(formDataToSend);
        showAlert("success", "Usuario creado con éxito");
      }

      resetForm();
      fetchUsuarios();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar el usuario";
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
              {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
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
                  <label className="form-label fw-bold">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Ángel"
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
                  {editingId ? "Guardar Cambios" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
