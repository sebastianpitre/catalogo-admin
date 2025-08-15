import { useState, useEffect } from "react";
import { createOneGroup, updateGroup, getGroupById } from "@/services/grupos";
import { showAlert } from "./alerts";
import nombresPersonalizados from "@/utils/permLabels";

export default function GruposForm({
  editingId,
  fetchGrupos,
  resetForm,
  permisos = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    permission_ids: [],
  });

  const [permSearch, setPermSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      const loadGruposData = async () => {
        try {
          setIsLoading(true);
          const res = await getGroupById(editingId);
          const data = res.data || res;

          setFormData({
            name: data.name || "",
            permission_ids:
              data.permission_ids && data.permission_ids.length > 0
                ? data.permission_ids
                : (data.permissions || []).map((p) => p.id),
          });
        } catch (error) {
          showAlert("error", "Error al cargar el grupo");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      loadGruposData();
    } else {
      setFormData({ name: "", permission_ids: [] });
    }
  }, [editingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);
    const checked = e.target.checked;
    setFormData((prevData) => {
      let updatedIds = [...prevData.permission_ids];
      if (checked && !updatedIds.includes(value)) {
        updatedIds.push(value);
      } else if (!checked) {
        updatedIds = updatedIds.filter((id) => id !== value);
      }
      return { ...prevData, permission_ids: updatedIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      (formData.permission_ids || []).forEach((id) =>
        formDataToSend.append("permission_ids", id)
      );

      if (editingId) {
        await updateGroup(editingId, formDataToSend);
        showAlert("success", "Grupo actualizado con éxito");
      } else {
        await createOneGroup(formDataToSend);
        showAlert("success", "Grupo creado con éxito");
      }

      resetForm();
      fetchGrupos();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar el grupo";
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

  const toggleAllPermissions = () => {
    if (formData.permission_ids.length === permisos.length) {
      setFormData((prev) => ({ ...prev, permission_ids: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permission_ids: permisos.map((p) => p.id),
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="card mb-4 form-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {editingId ? "Editar Grupo" : "Crear Nuevo Grupo"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={resetForm}
              aria-label="Close"
            ></button>
          </div>

          <div className="card-body">
            {isLoading ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre del grupo</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Vendedor"
                  />
                </div>

                {/* Permisos */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Permisos</label>

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Buscar permiso..."
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn btn-sm bg-lunalu mb-3"
                    onClick={toggleAllPermissions}
                  >
                    {formData.permission_ids.length === permisos.length
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>

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
                          onChange={handleCheckboxChange}
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
                    {editingId ? "Guardar Cambios" : "Crear grupo"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
