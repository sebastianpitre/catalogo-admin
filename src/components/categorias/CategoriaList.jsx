import { FiEdit, FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteCategory } from "@/services/categorias";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function CategoriaList({
  loading,
  categories,
  searchTerm,
  handleEdit,
  fetchCategories,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredCategories = categories.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando categorías...</p>
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron categorías con ese nombre"
              : "No hay categorías registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_categoria") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera categoría
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-md-3 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredCategories.map((cat) => (
        <div className="col" key={cat.id}>
          <div
            className="card bg-gray w-100 d-flex flex-column"
            style={{ height: "100%" }}
          >
            <span
              className={`${
                cat.estado ? "bg-lunalu" : "bg-secondary"
              } opacity-9 pb-1 col-4 text-white text-center position-absolute`}
              style={{ zIndex: 3, borderRadius: "5px 0px 10px" }}
            >
              {cat.estado ? "Activa" : "Inactiva"}
            </span>

            <div
              className="card-header p-0 position-relative z-index-2 flex-grow-0"
              style={{ borderRadius: "0.35rem 0.35rem 0px 0px" }}
            >
              <div className="d-block blur-shadow-image">
                <div
                  className="img-container"
                  style={{
                    height: "170px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cat.imagen ? (
                    <img
                      src={cat.imagen}
                      alt={cat.nombre}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      style={{
                        borderRadius: "0.35rem 0.35rem 0px 0px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  ) : (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.35rem 0.35rem 0px 0px",
                      }}
                    >
                      <FiImage size={48} className="opacity-50" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card-body px-2 py-0 d-flex flex-column flex-grow-1">
              <h6
                className="text-dark text-center nombre mb-0"
                style={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cat.nombre}
              </h6>

              <div className="mt-auto pt-1 pb-1 text-center">
                {hasPermission(user, "change_categoria") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(cat.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}

                {hasPermission(user, "delete_categoria") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar esta categoría?",
                        async () => {
                          try {
                            await deleteCategory(cat.id);
                            showAlert(
                              "success",
                              "Categoría eliminada correctamente"
                            );
                            fetchCategories();
                          } catch (error) {
                            showAlert(
                              "error",
                              "Error al eliminar la categoría"
                            );
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
