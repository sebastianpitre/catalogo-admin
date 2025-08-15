import { useContext } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function ColoresHeader({
  searchTerm,
  setSearchTerm,
  setIsFormVisible,
  resetForm,
}) {
  const { user } = useContext(AuthContext);

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-2">
        <h4 className="mb-0">
          Gestión de <span className="text-lunalu">Colores</span>
        </h4>
        {/* Usamos hasPermission como en ColoresList */}
        {hasPermission(user, "add_color") && (
          <button
            className="btn bg-lunalu btn-sm ms-3"
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
          >
            <FiPlus className="me-1" /> Nuevo Color
          </button>
        )}
      </div>

      <div className="input-group search-input mb-2">
        <span className="input-group-text">
          <FiSearch />
        </span>
        <input
          type="text"
          placeholder="Buscar colores..."
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
    </div>
  );
}
