import { useImperativeHandle, forwardRef, useState, useEffect } from "react";
import {
  createOneGarment,
  updateGarment,
  getGarmentById,
} from "@/services/prendas";
import { getAllCategories } from "@/services/categorias";
import { showAlert } from "./alerts";

const PrendaForm = forwardRef(
  (
    {
      editingId,
      fetchPrendas,
      resetForm,
      onSuccess,
      onContinue,
      compactMode = false,
    },
    ref
  ) => {
    const [formData, setFormData] = useState({
      categoria_id: "",
      nombre: "",
      disponible: false,
      precio: 0,
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdPrendaId, setCreatedPrendaId] = useState(null);

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const catRes = await getAllCategories();
          const cats = Array.isArray(catRes) ? catRes : catRes.data || [];
          setCategorias(cats);

          if (editingId) {
            const res = await getGarmentById(editingId);
            setFormData({
              categoria_id: res.categoria?.id || res.categoria_id || "",
              nombre: res.nombre || "",
              disponible: res.disponible || false,
              precio: res.precio || 0,
            });
          }
        } catch (error) {
          showAlert("error", "Error al cargar datos");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [editingId]);

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      });
    };

    // ✅ Exponer `handleSubmit` al padre
    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    const handleSubmit = async (e) => {
      if (e) e.preventDefault();
      setLoading(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("categoria_id", formData.categoria_id);
        formDataToSend.append("nombre", formData.nombre);
        formDataToSend.append("disponible", formData.disponible);
        formDataToSend.append("precio", formData.precio);

        let result;
        if (editingId) {
          result = await updateGarment(editingId, formDataToSend);
          showAlert("success", "Prenda actualizada con éxito");
        } else {
          result = await createOneGarment(formDataToSend);
          showAlert("success", "Prenda creada con éxito");
          setCreatedPrendaId(result.id);
        }

        if (onSuccess) onSuccess(result.id);
        if (!editingId && !onContinue) resetForm();
        fetchPrendas();
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Error al guardar la prenda";
        showAlert("error", errorMsg);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={`card mb-3 ${compactMode ? "shadow-sm" : "form-card"}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {editingId
              ? compactMode
                ? "Editar básico"
                : "Editar prenda básica"
              : "Crear Prenda Básica"}
          </h5>
          {!compactMode && (
            <button
              type="button"
              className="btn-close"
              onClick={resetForm}
              aria-label="Close"
              disabled={loading}
            ></button>
          )}
        </div>
        <div className="card-body">
          {/* 🔥 Quitamos el submit aquí si lo harás desde fuera */}
          <form>
            <div className="row mt-n2">
              <div className="col-sm-6 col-xl-12">
                <label className="form-label fw-bold mt-1">Categoría</label>
                <select
                  name="categoria_id"
                  className="form-select mt-n1"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  required
                  disabled={loading || categorias.length === 0}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 col-xl-12">
                <label className="form-label fw-bold mt-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control mt-n1"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Suéter oversize"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <label className="form-label fw-bold mt-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  className="form-control mt-n1"
                  value={
                    formData.precio === 0 ? "" : Number(formData.precio)
                  }
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-6 d-flex align-items-end">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="disponible"
                    id="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="disponible">
                    Disponible
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {!compactMode && !editingId && onContinue && createdPrendaId && (
          <div className="card-footer bg-white border-0">
            <button
              type="button"
              className="btn bg-lunalu w-100"
              onClick={() => onContinue(createdPrendaId)}
              disabled={loading}
            >
              Continuar a detalles
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default PrendaForm;
