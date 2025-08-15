import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteUser } from "../../services/usuarios";
import { FaUser } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function UsuariosList({
  loading,
  usuarios,
  searchTerm,
  handleEdit,
  fetchUsuarios,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  // 🚫 Si no tiene ni siquiera permiso de vista, no renderiza nada
  if (!hasPermission(user, "view_user")) {
    return (
      <div className="alert alert-warning text-center mt-4">
        No tienes permisos para ver esta información.
      </div>
    );
  }

  const filteredUsuarios = usuarios.filter((usu) =>
    usu.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    );
  }

  if (filteredUsuarios.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron usuarios con ese nombre"
              : "No hay usuarios registrados"}
          </h5>
          {!searchTerm && hasPermission(user, "add_user") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primer usuario
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredUsuarios.map((usu) => (
        <div className="col" key={usu.id}>
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-body">
              <FaUser
                className="position-absolute"
                style={{
                  top: "10px",
                  left: "10px",
                  fontSize: "1.2rem",
                  color: "#f6a0a0",
                }}
                title="Usuario"
              />
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {usu.username}
                </h6>
              </div>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_user") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(usu.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}
                {hasPermission(user, "delete_user") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar este usuario?",
                        async () => {
                          try {
                            await deleteUser(usu.id);
                            showAlert(
                              "success",
                              "Usuario eliminado correctamente"
                            );
                            fetchUsuarios();
                          } catch (error) {
                            showAlert("error", "Error al eliminar el usuario");
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
