import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteNotification } from "@/services/notificaciones";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function NotificacionList({
  loading,
  notificaciones,
  searchTerm,
  handleEdit,
  fetchNotificaciones,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredNotificaciones = notificaciones.filter((noti) =>
    (noti?.titulo ?? "")
      .toLowerCase()
      .includes((searchTerm ?? "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando notificaciones...</p>
      </div>
    );
  }

  if (filteredNotificaciones.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron notificaciones con ese título"
              : "No hay notificaciones registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_notificacion") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera notificación
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredNotificaciones.map((noti) => (
        <div className="col" key={noti.id}>
          <div className="card h-100 shadow-sm position-relative">
            {/* Ícono arriba a la izquierda */}
            <MdOutlineNotificationsActive
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "1.2rem",
                color: "#f6a0a0",
              }}
              title="Notificación"
            />
            <div className="card-body">
              <div className="d-flex mt-4 justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {noti.titulo}
                </h6>
              </div>
              <p className="card-text">{noti.descripcion}</p>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_notificacion") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(noti.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}
                {hasPermission(user, "delete_notificacion") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar esta notificación?",
                        async () => {
                          try {
                            await deleteNotification(noti.id);
                            showAlert(
                              "success",
                              "Notificación eliminada correctamente"
                            );
                            fetchNotificaciones();
                          } catch (error) {
                            showAlert(
                              "error",
                              "Error al eliminar la notificación"
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
