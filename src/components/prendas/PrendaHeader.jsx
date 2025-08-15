import { FiPlus, FiSearch, FiX, FiArrowLeft } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function PrendaHeader({
  viewMode,
  searchTerm,
  setSearchTerm,
  setIsFormVisible,
  resetForm,
  showBackButton = false,
  onBack,
}) {
  const { user } = useContext(AuthContext);
  const isEditingView =
    viewMode === "form" || viewMode === "details" || viewMode === "both";

  return (
    <div className="">
      {/* Mostrar solo el título cuando se está en vista de edición o detalle */}
      {isEditingView && (
        <div className="d-flex justify-content-between align-items-center mb-3 mb-md-2">
          <h4 className="mb-0">
            Gestión de <span className="text-lunalu">Prendas</span>
          </h4>
        </div>
      )}

      {/* Mostrar solo el buscador y botón cuando esté en vista de lista */}
      {viewMode === "list" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 mb-md-2">
            <h4 className="mb-0">
              Gestión de <span className="text-lunalu">Prendas</span>
            </h4>
            {hasPermission(user, "add_prenda") && (
              <button
                className="btn bg-lunalu btn-sm ms-3"
                onClick={() => {
                  resetForm();
                  setIsFormVisible(true);
                }}
              >
                <FiPlus className="me-1" />
                Nueva Prenda
              </button>
            )}
          </div>

          <div className="input-group search-input mb-2">
            <span className="input-group-text">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Prendas..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                <FiX />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
