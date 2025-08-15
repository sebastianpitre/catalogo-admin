import { useState, useRef, useEffect } from "react";
import {
  createOneCategory,
  updateCategory,
  getCategoryById,
} from "@/services/categorias";
import { showAlert } from "./alerts";
import { FiX, FiUpload, FiImage } from "react-icons/fi";

export default function CategoriaForm({
  editingId,
  fetchCategories,
  resetForm,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true,
    imagen: null,
    imagenPreview: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      const loadCategoryData = async () => {
        try {
          const res = await getCategoryById(editingId);
          setFormData({
            nombre: res.data?.nombre || res.nombre,
            descripcion: res.data?.descripcion || res.descripcion,
            estado: res.data?.estado ?? res.estado ?? true,
            imagen: null,
            imagenPreview: res.data?.imagen || res.imagen || null,
          });
        } catch (error) {
          showAlert("error", "Error al cargar la categoría");
          console.error(error);
        }
      };
      loadCategoryData();
    }
  }, [editingId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
        imagenPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("estado", formData.estado);

      if (formData.imagen) {
        formDataToSend.append("imagen", formData.imagen);
      }

      if (editingId) {
        await updateCategory(editingId, formDataToSend);
        showAlert("success", "Categoría actualizada con éxito");
      } else {
        await createOneCategory(formDataToSend);
        showAlert("success", "Categoría creada con éxito");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al guardar la categoría";
      showAlert("error", errorMsg);
      console.error(error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      imagen: null,
      imagenPreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div 
      className="modal-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
        overflowY: 'auto',
        padding: '20px'
      }}>
      <div className="modal-content" 
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '95vh',
          overflowY: 'auto',
          borderRadius: '8px'
        }}>

          <div className="card form-card">
            <div className="card-header d-flex justify-content-between bg-white align-items-center" style={{position: "sticky", top:"0px"}}>
              <h5 className="mb-0">
                {editingId ? "Editar Categoría" : "Crear Nueva Categoría"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={resetForm}
                aria-label="Close"
              ></button>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-bold">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: Ropa deportiva"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Estado</label>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="estado"
                        checked={formData.estado}
                        onChange={handleInputChange}
                        role="switch"
                        id="flexSwitchCheckChecked"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        {formData.estado ? (
                          <span className="text-success">Activo</span>
                        ) : (
                          <span className="text-danger">Inactivo</span>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold d-block">
                        Imagen de la categoría
                      </label>

                      {formData.imagenPreview ? (
                        <div className="image-preview-container py-2 border">
                          <img
                            src={formData.imagenPreview}
                            alt="Preview"
                            className="image-preview"
                          />
                          <button
                            type="button"
                            className="btn bg-danger position-absolute text-white pt-1"
                            style={{right:"10px", top:"10px"}}
                            onClick={removeImage}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="image-upload-container"
                          onClick={triggerFileInput}
                        >
                          <FiImage size={48} className="mb-3 upload-icon" />
                          <p className="mb-2">Haz clic para subir una imagen</p>
                          <p className="text-muted small">
                            Formatos soportados: JPG, PNG (Máx. 2MB)
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="d-none"
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm mt-2"
                        onClick={triggerFileInput}
                      >
                        <FiUpload className="me-1" />{" "}
                        {formData.imagenPreview ? "Cambiar imagen" : "Seleccionar imagen"}
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Descripción</label>
                      <textarea
                        name="descripcion"
                        className="form-control"
                        rows="3"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        placeholder="Descripción detallada de la categoría..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end bg-white pb-1 pt-1" style={{position:"sticky", bottom:"0px"}}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn bg-lunalu">
                    {editingId ? "Guardar Cambios" : "Crear Categoría"}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
    </div>
    
  );
}
