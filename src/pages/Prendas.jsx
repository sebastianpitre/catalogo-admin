import { useState, useEffect, useRef } from "react";
import { getAllGarments } from "../services/prendas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrendaHeader from "../components/prendas/PrendaHeader";
import PrendaForm from "../components/prendas/PrendaForm";
import PrendaDetailsForm from "../components/prendas/PrendaDetailsForm/index";
import PrendaList from "../components/prendas/PrendaList";
import { showAlert } from "../components/prendas/alerts";
import "../components/prendas/styles.css";

export default function Prendas() {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [createdPrendaId, setCreatedPrendaId] = useState(null);

  // Dos refs separados para crear y editar
  const createFormRef = useRef();
  const editFormRef = useRef();

  useEffect(() => {
    fetchPrendas();
  }, []);

  const fetchPrendas = async () => {
    try {
      setLoading(true);
      const response = await getAllGarments();

      let prendasData = [];
      if (Array.isArray(response)) {
        prendasData = response;
      } else if (Array.isArray(response.data)) {
        prendasData = response.data;
      } else if (Array.isArray(response.result)) {
        prendasData = response.result;
      }

      setPrendas(prendasData);
    } catch (error) {
      showAlert("error", "Error al cargar las prendas");
      console.error("Error detallado:", error);
      setPrendas([]);
    } finally {
      setLoading(false);
    }
  };

  const resetView = () => {
    setEditingId(null);
    setViewMode("list");
    setCreatedPrendaId(null);
  };

  const handleCreationSuccess = (prendaId) => {
    setCreatedPrendaId(prendaId);
    setViewMode("details");
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setViewMode("both");
  };

  return (
    <div className="container-fluid py-4 Coloress-container">
      <ToastContainer
        toastClassName="custom-toast-container"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />

      <PrendaHeader
        viewMode={viewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={() => {
          setEditingId(null);
          setViewMode("form");
        }}
        resetForm={resetView}
        onBack={resetView}
      />

      {/* Vista de crear prenda */}
      {viewMode === "form" && (
        <>
          <div className="col-12 col-xl-6 mx-xl-auto">
            <PrendaForm
              ref={createFormRef}
              editingId={editingId}
              fetchPrendas={fetchPrendas}
              resetForm={resetView}
              onSuccess={(id) => handleCreationSuccess(id)}
              onContinue={(id) => handleCreationSuccess(id)}
            />
          </div>

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetView}
            >
              Volver
            </button>

            <button
              type="button"
              className="btn bg-lunalu"
              onClick={() => createFormRef.current?.submitForm()}
            >
              Guardar
            </button>
          </div>
        </>
      )}

      {/* Vista de solo detalles */}
      {viewMode === "details" && (
        <PrendaDetailsForm
          prendaId={editingId || createdPrendaId}
          onComplete={resetView}
          onBack={() => setViewMode(editingId ? "both" : "form")}
          showBasicEditButton={!!editingId}
          onEditBasic={() => setViewMode("both")}
        />
      )}

      {/* Vista de editar básico + detalles */}
      {viewMode === "both" && editingId && (
        <>
          <div className="row">
            <div className="col-12 col-xl-3">
              <PrendaForm
                key={editingId}
                ref={editFormRef}
                editingId={editingId}
                fetchPrendas={fetchPrendas}
                resetForm={resetView}
                onSuccess={() => {
                  fetchPrendas();
                  resetView(); // Regresa a la lista después de guardar
                }}
                compactMode={true}
              />
            </div>

            <div className="col-xl-9">
              <PrendaDetailsForm
                prendaId={editingId}
                onComplete={resetView}
                onBack={() => setViewMode("list")}
                compactMode={true}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetView}
            >
              Volver
            </button>

            <button
              type="button"
              className="btn bg-lunalu"
              onClick={() => editFormRef.current?.submitForm()}
            >
              Guardar Cambios
            </button>
          </div>
        </>
      )}

      {/* Vista de lista */}
      {viewMode === "list" && (
        <PrendaList
          loading={loading}
          prendas={prendas}
          searchTerm={searchTerm}
          handleEdit={handleEdit}
          fetchPrendas={fetchPrendas}
          setIsFormVisible={() => setViewMode("form")}
        />
      )}
    </div>
  );
}
