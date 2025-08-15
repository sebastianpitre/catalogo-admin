import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteQuestion } from "@/services/preguntas";
import { CiCircleQuestion } from "react-icons/ci";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function PreguntaList({
  loading,
  preguntas,
  searchTerm,
  handleEdit,
  fetchPreguntas,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredPreguntas = preguntas.filter((pre) =>
    (pre?.pregunta ?? "")
      .toLowerCase()
      .includes((searchTerm ?? "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando preguntas...</p>
      </div>
    );
  }

  if (filteredPreguntas.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron preguntas con ese texto"
              : "No hay preguntas registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_pregunta") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera pregunta
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredPreguntas.map((pre) => (
        <div className="col" key={pre.id}>
          <div className="card h-100 shadow-sm position-relative">
            <CiCircleQuestion
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "1.2rem",
                color: "#f6a0a0",
              }}
              title="Pregunta"
            />
            <div className="card-body">
              <div className="d-flex mt-4 justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {pre.pregunta}
                </h6>
              </div>
              <p className="card-title mb-2">{pre.respuesta}</p>
            </div>
            <div className="card-footer bg-white border-0 pt-2 mx-2">
              <div className="d-flex justify-content-center">
                {hasPermission(user, "change_preguntas") && (
                  <button
                    className="btn btn-sm bg-lunalu me-2"
                    onClick={() => handleEdit(pre.id)}
                    title="Editar"
                  >
                    <FiEdit />
                  </button>
                )}
                {hasPermission(user, "delete_preguntas") && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      showConfirmDialog(
                        "¿Estás seguro de eliminar esta pregunta?",
                        async () => {
                          try {
                            await deleteQuestion(pre.id);
                            showAlert(
                              "success",
                              "Pregunta eliminada correctamente"
                            );
                            fetchPreguntas();
                          } catch (error) {
                            showAlert("error", "Error al eliminar la pregunta");
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
