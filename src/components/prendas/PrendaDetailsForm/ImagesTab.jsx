import { useState, useContext } from "react";
import { FiEdit, FiTrash2, FiUpload } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function ImagesTab({
  images,
  loading,
  onImageSelect,
  onImageUpload,
  onEdit,
  onDelete,
  onSelectPortada,
  portadaId,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPortadaId, setSelectedPortadaId] = useState(portadaId || null);

  const { user } = useContext(AuthContext);

  const canAddImage = hasPermission(user, "add_imagenprenda");
  const canDeleteImage = hasPermission(user, "delete_imagenprenda");
  const canEditImage = hasPermission(user, "change_imagenprenda");

  const handleSelectPortada = () => {
    if (selectedPortadaId) {
      onSelectPortada(selectedPortadaId);
      setShowModal(false);
    }
  };

  return (
    <div>
      {canAddImage && (
        <div className="mb-3">
          <label className="form-label">Subir imagen</label>
          <div className="mb-3">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={onImageSelect}
              accept="image/*"
              disabled={loading}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn bg-lunalu"
              onClick={onImageUpload}
              disabled={loading}
            >
              <FiUpload className="me-1" /> Subir Imagen
            </button>

            {canEditImage && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowModal(true)}
                disabled={images?.length === 0}
              >
                Elegir portada
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-3">
        <h6>Imágenes subidas:</h6>
        <div className="d-flex flex-wrap gap-3">
          {images?.map((img) => (
            <div
              key={img.id}
              className="position-relative"
              style={{ width: "120px" }}
            >
              <img
                src={img.url}
                alt={`Imagen ${img.id}`}
                className="img-thumbnail w-100"
                style={{
                  height: "120px",
                  objectFit: "cover",
                  border:
                    img.id === portadaId
                      ? "3px solid #198754"
                      : "1px solid #dee2e6",
                  boxShadow: img.id === portadaId ? "0 0 8px #198754" : "none",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
              />
              {img.id === portadaId && (
                <span className="position-absolute top-0 start-0 badge bg-success m-1">
                  Portada
                </span>
              )}

              {canDeleteImage && (
                <div className="position-absolute top-0 end-0 d-flex gap-1 m-1">
                  <button
                    className="btn btn-sm btn-outline-danger p-1"
                    onClick={() => onDelete(img)}
                    disabled={loading}
                    style={{ lineHeight: 1 }}
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {images?.length === 0 && (
            <span className="text-muted">No hay imágenes subidas</span>
          )}
        </div>
      </div>

      {/* Modal para seleccionar portada */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar imagen de portada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {images?.length === 0 ? (
            <p className="text-muted">No hay imágenes asignadas</p>
          ) : (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`Imagen ${img.id}`}
                  onClick={() => setSelectedPortadaId(img.id)}
                  className="img-thumbnail"
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedPortadaId === img.id
                        ? "3px solid #198754"
                        : "1px solid #ccc",
                    boxShadow:
                      selectedPortadaId === img.id
                        ? "0 0 10px #198754"
                        : "none",
                  }}
                />
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleSelectPortada}
            disabled={!selectedPortadaId}
          >
            Confirmar portada
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
