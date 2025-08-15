import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteSize } from "@/services/tallas";
import { IoPricetagOutline } from "react-icons/io5";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function DescripcionList({
  loading,
  tallas,
  searchTerm,
  handleEdit,
  fetchTallas,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredTallas = tallas.filter((talla) =>
    (talla?.nombre ?? "")
      .toLowerCase()
      .includes((searchTerm ?? "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando tallas...</p>
      </div>
    );
  }

  if (filteredTallas.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron tallas con ese texto"
              : "No hay tallas registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_talla") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera talla
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredTallas.map((talla) => (
        <div className="col" key={talla.id}>
          <div className="card h-100 shadow-sm position-relative">
            <IoPricetagOutline
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "1.2rem",
                color: "#f6a0a0",
              }}
              title="Talla"
            />
            <div className="card-body">
              <div className="d-flex mt-4 justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {talla.nombre}
                </h6>
              </div>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_talla") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(talla.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}
                {hasPermission(user, "delete_talla") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar esta talla?",
                        async () => {
                          try {
                            await deleteSize(talla.id);
                            showAlert(
                              "success",
                              "Talla eliminada correctamente"
                            );
                            fetchTallas();
                          } catch (error) {
                            showAlert("error", "Error al eliminar la Talla");
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
