import { useState, useRef, useEffect } from "react";
import { createOneUser, updateUser, getUserById } from "@/services/usuarios";
import { showAlert } from "./alerts";
import nombresPersonalizados from "@/utils/permLabels";

export default function UsariosForm({
  editingId,
  fetchUsuarios,
  resetForm,
  permisos = [],
  grupos = [],
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    group_ids: [],
    permission_ids: [],
  });

  const [permSearch, setPermSearch] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadUsersData = async () => {
        try {
          const res = await getUserById(editingId);
          const data = res.data || res;

          setFormData({
            username: data.username || "",
            email: data.email || "",
            password: "",
            group_ids: (data.groups || []).map((g) => g.id),
            permission_ids: (data.user_permissions || []).map((p) => p.id),
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

  const handlePermissionChange = (e) => {
    const value = parseInt(e.target.value);
    const checked = e.target.checked;
    setFormData((prevData) => {
      let updated = [...prevData.permission_ids];
      if (checked && !updated.includes(value)) {
        updated.push(value);
      } else if (!checked) {
        updated = updated.filter((id) => id !== value);
      }
      return { ...prevData, permission_ids: updated };
    });
  };

  const handleGroupChange = (e) => {
    const value = parseInt(e.target.value);
    const checked = e.target.checked;
    setFormData((prevData) => {
      let updated = [...prevData.group_ids];
      if (checked && !updated.includes(value)) {
        updated.push(value);
      } else if (!checked) {
        updated = updated.filter((id) => id !== value);
      }
      return { ...prevData, group_ids: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        group_ids: formData.group_ids,
        permission_ids: formData.permission_ids,
      };

      if (editingId) {
        await updateUser(editingId, payload);
        showAlert("success", "Usuario actualizado con éxito");
      } else {
        await createOneUser(payload);
        showAlert("success", "Usuario creado con éxito");
      }

      resetForm();
      fetchUsuarios();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message ||
        "Error al guardar el usuario";
      showAlert("error", errorMsg);
      console.error(error);
    }
  };

  const filteredPermisos = permisos
    .sort((a, b) =>
      (nombresPersonalizados[a.name] || a.name).localeCompare(
        nombresPersonalizados[b.name] || b.name
      )
    )
    .filter((permiso) =>
      (nombresPersonalizados[permiso.name] || permiso.name)
        .toLowerCase()
        .includes(permSearch.toLowerCase())
    );
  const toggleAllPermisos = () => {
    if (formData.permission_ids.length === permisos.length) {
      setFormData((prevData) => ({ ...prevData, permission_ids: [] }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        permission_ids: permisos.map((permiso) => permiso.id),
      }));
    }
  };

  // Seleccionar / deseleccionar todos los grupos
  const toggleAllGrupos = () => {
    if (formData.group_ids.length === grupos.length) {
      setFormData((prevData) => ({ ...prevData, group_ids: [] }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        group_ids: grupos.map((grupo) => grupo.id),
      }));
    }
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
          maxWidth: "600px",
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
              {/* Usuario */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre de usuario</label>
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

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ej: angel@mail.com"
                />
              </div>

              {/* Contraseña */}
              {!editingId && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="********"
                  />
                </div>
              )}

              {/* Grupos */}
              <div className="mb-3">
                <label className="form-label fw-bold d-flex justify-content-between">
                  Grupos
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleAllGrupos}
                  >
                    {formData.group_ids.length === grupos.length
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>
                </label>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                >
                  {grupos.map((grupo) => (
                    <div key={grupo.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={grupo.id}
                        checked={formData.group_ids.includes(grupo.id)}
                        onChange={handleGroupChange}
                      />
                      <label className="form-check-label ms-2">
                        {grupo.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permisos */}
              <div className="mb-3">
                <label className="form-label fw-bold d-flex justify-content-between">
                  Permisos
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleAllPermisos}
                  >
                    {formData.permission_ids.length === permisos.length
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Buscar permiso..."
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                />
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                >
                  {filteredPermisos.map((permiso) => (
                    <div key={permiso.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={permiso.id}
                        checked={formData.permission_ids.includes(permiso.id)}
                        onChange={handlePermissionChange}
                      />
                      <label className="form-check-label ms-2">
                        {nombresPersonalizados[permiso.name] || permiso.name}
                      </label>
                    </div>
                  ))}
                  {filteredPermisos.length === 0 && (
                    <p className="text-muted text-center mt-2">
                      Sin resultados
                    </p>
                  )}
                </div>
              </div>

              {/* Botones */}
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
