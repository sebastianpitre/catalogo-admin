import { useState, useMemo, useEffect, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import ColoresForm from "../../colores/ColoresForm";
import { getAllColors } from "@/services/colores";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function ColorsTab({
  colors,
  loading,
  onAddColor,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [options, setOptions] = useState({ colores: [] });

  const { user } = useContext(AuthContext);

  const fetchColores = async () => {
    try {
      const res = await getAllColors();
      setOptions((prev) => ({ ...prev, colores: res }));
    } catch (error) {
      console.error("Error cargando colores:", error);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

  const isColorSelected = (colorId) => {
    return colors?.some((c) => {
      const colorObj = c.color || c;
      return colorObj.id === colorId;
    });
  };

  const getColorAvailability = (colorId) => {
    const colorAssignment = colors?.find((c) => {
      const colorObj = c.color || c;
      return colorObj.id === colorId;
    });
    return colorAssignment?.disponible ?? false;
  };

  const handleToggleColor = (color) => {
    const selected = isColorSelected(color.id);

    if (selected) {
      const found = colors.find((c) => (c.color?.id || c.id) === color.id);
      if (found) {
        deleteMode ? onDelete("colores", found) : onToggleAvailability(found);
      }
    } else {
      onAddColor(color.id);
    }
  };

  const filteredColors = useMemo(() => {
    return options.colores.filter(
      (color) =>
        !isColorSelected(color.id) &&
        color.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options.colores, colors]);

  const renderColorButton = (color, selected) => {
    const isAvailable = selected ? getColorAvailability(color.id) : false;
    const bgColor = isAvailable ? "#f6a0a0" : "#ffffff";
    const textColor = isAvailable ? "#ffffff" : "#999";
    const iconColor = isAvailable ? "#fff" : "#f6a0a0";

    return (
      <button
        key={color.id}
        className="btn position-relative border"
        onClick={() => handleToggleColor(color)}
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
        {color.nombre}
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
            <h5 className="text-bold mb-3">Colores seleccionados</h5>
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
          {colors?.length > 0 ? (
            colors.map((c) => renderColorButton(c.color || c, true))
          ) : (
            <p className="text-muted">No hay colores seleccionados</p>
          )}
        </div>
      </div>

      <div className="mb-3 border-top pt-2">
        <div className="row">
          <div className="col">
            <h5 className="text-bold">Seleccionar colores</h5>
          </div>

          {hasPermission(user, "add_colorprenda") && (
            <div className="col text-end mt-2" style={{ maxWidth: "125px" }}>
              <button
                className="btn btn-sm bg-lunalu"
                onClick={() => setShowAddModal(true)}
              >
                Crear nuevo
              </button>
            </div>
          )}
        </div>

        <div className="mb-2 pt-1 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar colores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap gap-2">
          {filteredColors.length > 0 ? (
            filteredColors
              .slice(0, 15)
              .map((color) => renderColorButton(color, false))
          ) : (
            <p className="text-muted">No hay colores disponibles</p>
          )}
        </div>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ColoresForm
            resetForm={() => setShowAddModal(false)}
            fetchColores={fetchColores}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
