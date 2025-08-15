import { useState, useMemo, useEffect, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import TallasForm from "../../tallas/TallasForm";
import { getAllSizes } from "@/services/tallas";

// 👇 PERMISOS
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function SizesTab({
  sizes,
  loading,
  onAddSize,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [options, setOptions] = useState({ tallas: [] });

  const { user } = useContext(AuthContext); // 🔐 acceso al usuario

  const fetchTallas = async () => {
    try {
      const res = await getAllSizes();
      setOptions({ tallas: res });
    } catch (error) {
      console.error("Error cargando tallas:", error);
    }
  };

  useEffect(() => {
    fetchTallas();
  }, []);

  const isSizeSelected = (sizeId) =>
    sizes?.some((s) => (s.talla || s).id === sizeId);

  const getSizeAvailability = (sizeId) => {
    const sizeAssignment = sizes?.find((s) => (s.talla || s).id === sizeId);
    return sizeAssignment?.disponible ?? false;
  };

  const handleToggleSize = (size) => {
    const selected = isSizeSelected(size.id);

    if (selected) {
      const found = sizes.find((s) => (s.talla?.id || s.id) === size.id);
      if (found) {
        deleteMode ? onDelete(found) : onToggleAvailability(found);
      }
    } else {
      onAddSize(size.id);
    }
  };

  const filteredSizes = useMemo(() => {
    return options.tallas.filter(
      (size) =>
        !isSizeSelected(size.id) &&
        size.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options.tallas, sizes]);

  const renderSizeButton = (size, selected) => {
    const isAvailable = selected ? getSizeAvailability(size.id) : false;
    const bgColor = isAvailable ? "#f6a0a0" : "#ffffff";
    const textColor = isAvailable ? "#ffffff" : "#999";
    const iconColor = isAvailable ? "#fff" : "#f6a0a0";

    return (
      <button
        key={size.id}
        className="btn position-relative border"
        onClick={() => handleToggleSize(size)}
        disabled={loading}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          Width: "auto",
          minWidth: "60px",
          fontWeight: isAvailable ? "600" : "200",
          transition: "all 0.3s ease",
          opacity: loading ? 0.7 : 1,
          cursor: "pointer",
        }}
      >
        {size.nombre}
        {selected && deleteMode && (
          <FiTrash2
            color={iconColor}
            style={{
              position: "absolute",
              top: "4px",
              right: "6px",
              fontSize: "14px",
            }}
          />
        )}
      </button>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <div className="row">
          <div className="col">
            <h5 className="text-bold mb-3">Tallas seleccionadas</h5>
          </div>
          <div className="col text-end" style={{ maxWidth: "55px" }}>
            <button
              className={`btn btn-sm ${
                deleteMode ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setDeleteMode((prev) => !prev)}
            >
              <FiTrash2
                className="mt-n1"
                style={{
                  fontSize: "15px",
                }}
              />
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {sizes?.length > 0 ? (
            sizes.map((s) => renderSizeButton(s.talla || s, true))
          ) : (
            <p className="text-muted">No hay tallas seleccionadas</p>
          )}
        </div>
      </div>

      <div className="mb-3 border-top pt-2">
        <div className="row">
          <div className="col">
            <h5 className="text-bold">Seleccionar tallas</h5>
          </div>
          {hasPermission(user, "add_talla") && (
            <div className="col text-end mt-2" style={{ maxWidth: "125px" }}>
              <button
                className="btn btn-sm bg-lunalu"
                onClick={() => setShowAddModal(true)}
              >
                Crear nueva
              </button>
            </div>
          )}
        </div>

        <div className="mb-2 pt-1 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar tallas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          {filteredSizes.length > 0 ? (
            filteredSizes
              .slice(0, 15)
              .map((size) => renderSizeButton(size, false))
          ) : (
            <p className="text-muted">No hay tallas disponibles</p>
          )}
        </div>
      </div>

      {/* Modal para agregar nueva talla */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TallasForm
            resetForm={() => setShowAddModal(false)}
            fetchTallas={fetchTallas}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
