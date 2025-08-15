import { useState, useEffect } from "react";
import { getAllCategories } from "../services/categorias";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriaHeader from "../components/categorias/CategoriaHeader";
import CategoriaForm from "../components/categorias/CategoriaForm";
import CategoriaList from "../components/categorias/CategoriaList";
import { showAlert } from "../components/categorias/alerts";
import "../components/categorias/styles.css";

export default function Categorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();

      let categoriesData = [];
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (Array.isArray(response.result)) {
        categoriesData = response.result;
      }

      setCategories(categoriesData);
    } catch (error) {
      showAlert("error", "Error al cargar las categorías");
      console.error("Error detallado:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="container-fluid py-4 Coloress-container">
      <ToastContainer
        toastClassName="custom-toast-container"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />

      <CategoriaHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsFormVisible={setIsFormVisible}
        resetForm={resetForm}
      />

      {(isFormVisible || editingId) && (
        <CategoriaForm
          editingId={editingId}
          fetchCategories={fetchCategories}
          resetForm={resetForm}
        />
      )}

      <CategoriaList
        loading={loading}
        categories={categories}
        searchTerm={searchTerm}
        handleEdit={setEditingId}
        fetchCategories={fetchCategories}
        setIsFormVisible={setIsFormVisible}
      />
    </div>
  );
}
