import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteGroup } from "@/services/grupos";
import { MdOutlineGroups } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function UsuariosList({
  loading,
  grupos,
  searchTerm,
  handleEdit,
  fetchGrupos,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredGrupos = grupos.filter((grup) =>
    grup.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando grupos...</p>
      </div>
    );
  }

  if (filteredGrupos.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron grupos con ese nombre"
              : "No hay grupos registrados"}
          </h5>
          {!searchTerm && hasPermission(user, "add_group") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primer grupo
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredGrupos.map((grup) => (
        <div className="col" key={grup.id}>
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-body">
              <MdOutlineGroups
                className="position-absolute"
                style={{
                  top: "10px",
                  left: "10px",
                  fontSize: "1.2rem",
                  color: "#f6a0a0",
                }}
                title="Grupo"
              />
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {grup.name}
                </h6>
              </div>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_group") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(grup.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}
                {hasPermission(user, "delete_group") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar este grupo?",
                        async () => {
                          try {
                            await deleteGroup(grup.id);
                            showAlert(
                              "success",
                              "Grupo eliminado correctamente"
                            );
                            fetchGrupos(); // FIXED esto era fetchColores()
                          } catch (error) {
                            showAlert("error", "Error al eliminar el grupo");
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
