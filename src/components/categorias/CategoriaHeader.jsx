import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function CategoriaHeader({
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
          Gestión de <span className="text-lunalu">Categorías</span>
        </h4>

        {hasPermission(user, "add_categoria") && (
          <button
            className="btn bg-lunalu btn-sm ms-3"
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
          >
            <FiPlus className="me-1" />
            Nueva Categoría
          </button>
        )}
      </div>

      <div className="input-group search-input mb-md-1">
        <span className="input-group-text">
          <FiSearch />
        </span>
        <input
          type="text"
          placeholder="Buscar categorías..."
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
