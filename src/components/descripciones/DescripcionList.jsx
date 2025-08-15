import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { MdOutlineDescription } from "react-icons/md";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteDescription } from "@/services/descripcion";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function DescripcionList({
  loading,
  descripciones,
  searchTerm,
  handleEdit,
  fetchDescripciones,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredDescripciones = descripciones.filter((desc) =>
    desc.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando descripciones...</p>
      </div>
    );
  }

  if (filteredDescripciones.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron descripciones con ese texto"
              : "No hay descripciones registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_descripcion") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera descripción
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredDescripciones.map((desc) => (
        <div className="col" key={desc.id}>
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-body">
              <MdOutlineDescription
                className="position-absolute"
                style={{
                  top: "10px",
                  left: "10px",
                  fontSize: "1.2rem",
                  color: "#f6a0a0",
                }}
                title="Descripción"
              />
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {desc.texto}
                </h6>
              </div>
            </div>
            <div className="card-footer bg-white mx-2 border-0 pt-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_descripcion") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(desc.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}

                {hasPermission(user, "delete_descripcion") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar esta descripción?",
                        async () => {
                          try {
                            await deleteDescription(desc.id);
                            showAlert(
                              "success",
                              "Descripción eliminada correctamente"
                            );
                            fetchDescripciones();
                          } catch (error) {
                            showAlert(
                              "error",
                              "Error al eliminar la descripción"
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
