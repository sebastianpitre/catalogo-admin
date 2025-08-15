import { useState, useContext } from "react";
import { Tab, Nav, Button } from "react-bootstrap";
import usePrendaData from "./usePrendaData";
import DescriptionTab from "./DescriptionTab";
import ColorsTab from "./ColorsTab";
import SizesTab from "./SizesTab";
import ImagesTab from "./ImagesTab";
import EditModal from "./EditModal";
import TallaColorTab from "./TallaColorTab.jsx";
import { showAlert } from "../alerts";
import { updateGarmentImage } from "../../../services/prendas.js";
import { AuthContext } from "../../../context/AuthContext"; // Asegúrate que esto apunta a tu contexto

export default function PrendaDetailsForm({
  prendaId,
  onComplete,
  onBack,
  showBasicEditButton = false,
  onEditBasic,
  compactMode = false,
}) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("descripciones");
  const [selectedItems, setSelectedItems] = useState({
    descripcion_id: "",
    color_id: "",
    talla_id: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isPortada, setIsPortada] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState("");

  const {
    prendaData,
    options,
    loading,
    handleAddDescription,
    handleAddColor,
    handleAddSize,
    handleImageUpload,
    handleDeleteItem,
    handleDeleteAsignacion,
    handleAddAsignacion,
    handleDeleteImage,
    handleToggleColorAvailability,
    handleToggleSizeAvailability,
    refreshData,
  } = usePrendaData(prendaId);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelectedItems((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenEditModal = (type, item) => {
    setEditType(type);
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSelectPortada = async (imagenId) => {
    const formData = new FormData();
    formData.append("es_portada", true);

    try {
      await updateGarmentImage(imagenId, formData);
      showAlert("success", "Imagen marcada como portada");
      await refreshData();
    } catch (error) {
      console.error("Error al marcar imagen como portada:", error);
      showAlert("error", "No se pudo marcar como portada");
    }
  };

  const handleSaveEdit = async (formData) => {
    try {
      await refreshData();
      showAlert("success", "Cambios guardados");
      setShowEditModal(false);
    } catch (error) {
      showAlert("error", "Error al guardar");
    }
  };

  const handleUploadImage = async () => {
    if (!imageFiles || imageFiles.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("prenda_id", prendaId);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("es_portada", isPortada);

      await handleImageUpload(formData);
      setImageFiles([]);
      setIsPortada(false);
      showAlert("success", "Imágenes subidas correctamente");
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      showAlert("error", "Error al subir imágenes");
    }
  };

  const hasPermission = (perm) => user?.permissions?.includes(perm);

  if (!prendaData) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  const tabs = [
    hasPermission("view_descripcionprenda") && {
      key: "descripciones",
      label: "Descripciones",
      content: (
        <DescriptionTab
          descriptions={prendaData.descripciones}
          options={options}
          loading={loading}
          selectedDesc={selectedItems.descripcion_id}
          onSelectDesc={(value) =>
            handleSelectChange({ target: { name: "descripcion_id", value } })
          }
          onAddDescription={(descId) => handleAddDescription(descId)}
          onEdit={(item) => handleOpenEditModal("descripcion", item)}
          onDelete={(item) => handleDeleteItem("descripciones", item)}
        />
      ),
    },
    hasPermission("view_prendacolor") && {
      key: "colores",
      label: "Colores",
      content: (
        <ColorsTab
          colors={prendaData.colores}
          options={options}
          loading={loading}
          onAddColor={handleAddColor}
          onToggleAvailability={handleToggleColorAvailability}
          onEdit={(item) => handleOpenEditModal("color", item)}
          onDelete={(type, item) => handleDeleteItem(type, item)}
        />
      ),
    },
    hasPermission("view_prendatalla") && {
      key: "tallas",
      label: "Tallas",
      content: (
        <SizesTab
          sizes={prendaData.tallas}
          options={options}
          loading={loading}
          selectedSize={selectedItems.talla_id}
          onSelectSize={(value) =>
            handleSelectChange({ target: { name: "talla_id", value } })
          }
          onToggleAvailability={handleToggleSizeAvailability}
          onAddSize={handleAddSize}
          onEdit={(item) => handleOpenEditModal("talla", item)}
          onDelete={(item) => handleDeleteItem("tallas", item)}
        />
      ),
    },
    hasPermission("view_prendatallacolor") && {
      key: "tallaColor",
      label: "Asignaciones",
      content: (
        <TallaColorTab
          tallasAsignadas={prendaData.tallas}
          coloresAsignados={prendaData.colores}
          combinaciones={prendaData.color_por_talla}
          onAddAsignacion={handleAddAsignacion}
          onDeleteAsignacion={handleDeleteAsignacion}
          loading={loading}
        />
      ),
    },
    hasPermission("view_imagenprenda") && {
      key: "imagenes",
      label: "Imágenes",
      content: (
        <ImagesTab
          images={prendaData.imagenes}
          loading={loading}
          onImageSelect={(e) => {
            const files = Array.from(e.target.files);
            setImageFiles(files);
          }}
          onImageUpload={handleUploadImage}
          onEdit={(item) => handleOpenEditModal("imagen", item)}
          onDelete={handleDeleteImage}
          isPortada={isPortada}
          setIsPortada={setIsPortada}
          onSelectPortada={handleSelectPortada}
          portadaId={
            prendaData.imagenes.find((img) => img.es_portada)?.id || null
          }
        />
      ),
    },
  ].filter(Boolean);

  return (
    <div className={`card mb-3 ${compactMode ? "shadow-sm" : ""}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          {compactMode ? "Detalles" : `Gestionar prenda: ${prendaData.nombre}`}
        </h5>
        {showBasicEditButton && !compactMode && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={onEditBasic}
            disabled={loading}
          >
            Editar datos básicos
          </Button>
        )}
      </div>

      <div className="card-body">
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-4">
            {tabs.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {tabs.map((tab) => (
              <Tab.Pane eventKey={tab.key} key={tab.key}>
                {tab.content}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>

        <div className="mt-4 d-flex justify-content-between">
          {!compactMode && (
            <Button variant="success" onClick={onComplete} disabled={loading}>
              Finalizar
            </Button>
          )}
        </div>
      </div>

      <EditModal
        show={showEditModal}
        type={editType}
        item={editingItem}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        loading={loading}
      />
    </div>
  );
}
