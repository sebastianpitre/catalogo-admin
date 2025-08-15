import { useState, useMemo, useEffect, useContext } from "react";
import { Modal } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import DescripcionesForm from "../../descripciones/DescripcionForm";
import { getAllDescriptions } from "@/services/descripcion";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function DescriptionTab({
  descriptions,
  loading,
  onAddDescription,
  onEdit,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [options, setOptions] = useState({ descripciones: [] });

  const { user } = useContext(AuthContext);

  const fetchDescripciones = async () => {
    try {
      const res = await getAllDescriptions();
      setOptions((prev) => ({ ...prev, descripciones: res }));
    } catch (error) {
      console.error("Error cargando descripciones:", error);
    }
  };

  useEffect(() => {
    fetchDescripciones();
  }, []);

  const isSelected = (descId) => {
    return descriptions?.some((d) => {
      const obj = d.descripcion || d;
      return obj.id === descId;
    });
  };

  const handleToggle = (desc) => {
    const selected = isSelected(desc.id);

    if (selected) {
      const found = descriptions.find(
        (d) => (d.descripcion?.id || d.id) === desc.id
      );

      if (found && deleteMode) {
        const relationId = found.id || null;
        const descripcionObj = found.descripcion || found;
        onDelete({
          id: relationId,
          descripcion: descripcionObj,
        });
      }
    } else {
      onAddDescription(desc.id);
    }
  };

  const filteredDescriptions = useMemo(() => {
    return options.descripciones.filter(
      (desc) =>
        !isSelected(desc.id) &&
        (desc.texto || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options.descripciones, descriptions]);

  const renderButton = (desc, selected) => {
    const bgColor = selected ? "#f6a0a0" : "#ffffff";
    const textColor = selected ? "#ffffff" : "#999";
    const iconColor = selected ? "#fff" : "#f6a0a0";

    return (
      <button
        key={desc.id}
        className="btn position-relative border"
        onClick={() => handleToggle(desc)}
        disabled={loading}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          Width: "auto",
          minWidth: "60px",
          fontWeight: selected ? "600" : "200",
          transition: "all 0.3s ease",
          opacity: loading ? 0.7 : 1,
          cursor: "pointer",
        }}
      >
        {desc.texto || "Sin descripción"}
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
            <h5 className="text-bold mb-3">Descripciones seleccionadas</h5>
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
          {descriptions?.length > 0 ? (
            descriptions.map((d) => renderButton(d.descripcion || d, true))
          ) : (
            <p className="text-muted">No hay descripciones seleccionadas</p>
          )}
        </div>
      </div>

      <div className="mb-3 border-top pt-2">
        <div className="row">
          <div className="col">
            <h5 className="text-bold">Seleccionar descripciones</h5>
          </div>
          {hasPermission(user, "add_descripcion") && (
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
            placeholder="🔍 Buscar descripciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="d-flex flex-wrap gap-2">
          {filteredDescriptions.length > 0 ? (
            filteredDescriptions
              .slice(0, 15)
              .map((desc) => renderButton(desc, false))
          ) : (
            <p className="text-muted">No hay descripciones disponibles</p>
          )}
        </div>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva descripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DescripcionesForm
            resetForm={() => setShowAddModal(false)}
            fetchDescripciones={fetchDescripciones}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
