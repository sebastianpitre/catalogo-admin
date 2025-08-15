import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { CiImageOff } from "react-icons/ci";
import { showConfirmDialog, showAlert } from "./alerts";
import { deleteGarment } from "@/services/prendas";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function PrendaList({
  loading,
  prendas,
  searchTerm,
  handleEdit,
  fetchPrendas,
  setIsFormVisible,
}) {
  const { user } = useContext(AuthContext);

  const filteredPrendas = prendas.filter((pre) =>
    (pre?.nombre ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando prendas...</p>
      </div>
    );
  }

  if (filteredPrendas.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron prendas con ese nombre"
              : "No hay prendas registradas"}
          </h5>
          {!searchTerm && hasPermission(user, "add_prenda") && (
            <button
              className="btn bg-lunalu mt-3"
              onClick={() => setIsFormVisible(true)}
            >
              <FiPlus className="me-1" /> Crear primera prenda
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2">
      {filteredPrendas.map((pre) => {
        const PrendaCard = ({ pre }) => {
          const [selectedImageIndex, setSelectedImageIndex] = useState(0);
          const thumbnailsRef = useRef(null);

          const mainImage =
            pre.imagenes?.find((img) => img.es_portada) ||
            pre.imagenes?.[0] ||
            null;

          const thumbnails = (pre.imagenes || []).filter(
            (img) => img.id !== mainImage?.id
          );

          const allImages = mainImage ? [mainImage, ...thumbnails] : [];

          const handleWheel = (e) => {
            if (thumbnailsRef.current) {
              e.preventDefault();
              thumbnailsRef.current.scrollLeft += e.deltaY;
            }
          };

          return (
            <div className="card h-100 shadow-sm">
              <span
                className={`${
                  pre.disponible ? "bg-lunalu" : "bg-secondary"
                } opacity-9 pb-1 col-4 text-white text-center position-absolute`}
                style={{ zIndex: 3, borderRadius: "5px 0px 10px" }}
              >
                {pre.disponible ? "Activa" : "Inactiva"}
              </span>

              <div
                className="d-flex justify-content-center align-items-center bg-light"
                style={{
                  height: "250px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex]?.url}
                    className="card-img-top h-100 w-100 object-fit-cover"
                    alt={pre.nombre}
                  />
                ) : (
                  <CiImageOff size={50} className="text-muted" />
                )}
              </div>

              {allImages.length > 1 && (
                <div
                  className="px-2 py-2 bg-light"
                  style={{
                    height: "70px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  ref={thumbnailsRef}
                  onWheel={handleWheel}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div className="d-inline-flex gap-2 h-100">
                    {allImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className="d-inline-block"
                        style={{
                          width: "60px",
                          height: "60px",
                          border:
                            selectedImageIndex === index
                              ? "2px solid #0d6efd"
                              : "1px solid #dee2e6",
                          borderRadius: "4px",
                          overflow: "hidden",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-100 w-100 object-fit-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-0">{pre.nombre}</h5>
                    <p className="text-muted mb-0">{pre.categoria?.nombre}</p>
                  </div>
                </div>
                <p className="card-text">
                  <strong>Precio:</strong> ${pre.precio?.toLocaleString()}
                </p>
              </div>

              <div className="card-footer bg-white border-0 pt-0">
                <div className="d-flex justify-content-center">
                  {hasPermission(user, "change_prenda") && (
                    <button
                      className="btn btn-sm bg-lunalu me-2"
                      onClick={() => handleEdit(pre.id)}
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                  )}
                  {hasPermission(user, "delete_prenda") && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        showConfirmDialog(
                          "¿Estás seguro de eliminar esta prenda?",
                          async () => {
                            try {
                              await deleteGarment(pre.id);
                              showAlert(
                                "success",
                                "Prenda eliminada correctamente"
                              );
                              fetchPrendas();
                            } catch (error) {
                              showAlert("error", "Error al eliminar la prenda");
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
          );
        };

        return (
          <div className="col" key={pre.id}>
            <PrendaCard pre={pre} />
          </div>
        );
      })}
    </div>
  );
}
