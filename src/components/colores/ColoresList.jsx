import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { BiColorFill } from "react-icons/bi"; // 👈 ICONO IMPORTADO
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteColor } from "@/services/colores";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function ColoresList({
  loading,
  colores,
  searchTerm,
  handleEdit,
  fetchColores,
  setIsFormVisible,
}) {
  const filteredColores = colores.filter((col) =>
    col.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { user } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando colores...</p>
      </div>
    );
  }

  if (filteredColores.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron colores con ese nombre"
              : "No hay colores registradas"}
          </h5>
          {!searchTerm && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primer color
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredColores.map((col) => (
        <div className="col" key={col.id}>
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-body">
              {/* ICONO ARRIBA A LA DERECHA */}
              <BiColorFill
                className="position-absolute"
                style={{
                  top: "10px",
                  left: "10px",
                  fontSize: "1.2rem",
                  color: "#f6a0a0",
                }}
                title="Color de fondo"
              />
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {col.nombre}
                </h6>
              </div>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_color") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(col.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}

                {hasPermission(user, "delete_color") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar este color?",
                        async () => {
                          try {
                            await deleteColor(col.id);
                            showAlert(
                              "success",
                              "Color eliminado correctamente"
                            );
                            fetchColores();
                          } catch (error) {
                            showAlert("error", "Error al eliminar el color");
                            console.error(error);
                          }
                        }
                      )
                    }
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
