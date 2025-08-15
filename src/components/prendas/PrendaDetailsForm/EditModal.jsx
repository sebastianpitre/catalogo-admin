import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditModal({
  show,
  type,
  item,
  onClose,
  onSave,
  loading,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const getModalTitle = () => {
    switch (type) {
      case "descripcion":
        return "Editar Descripción";
      case "color":
        return "Editar Color";
      case "talla":
        return "Editar Talla";
      case "imagen":
        return "Editar Imagen";
      default:
        return "Editar";
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === "descripcion" && (
          <Form.Group>
            <Form.Label>Texto</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="texto"
              value={formData.texto || ""}
              onChange={handleChange}
            />
          </Form.Group>
        )}

        {type === "color" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Código HEX</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={formData.codigo || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </>
        )}

        {/* Similar para otros tipos... */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={() => onSave(formData)}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
