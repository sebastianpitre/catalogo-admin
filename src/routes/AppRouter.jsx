import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Categorias from "../pages/Categorias";
import Colores from "../pages/Colores";
import Descripciones from "../pages/Descripciones";
import Notificaciones from "../pages/Notificaciones";
import Preguntas from "../pages/Preguntas";
import Prendas from "../pages/Prendas";
import Tallas from "../pages/Tallas";
import Usuarios from "../pages/Usuarios";
import Grupos from "../pages/Grupos";
import Permisos from "../pages/Permisos";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import PasswordRecovery from "../pages/PasswordRecovery";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/password-recovery" element={<PasswordRecovery />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />

        <Route
          path="categorias"
          element={
            <ProtectedRoute requiredPermission="view_categoria">
              <Categorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="colores"
          element={
            <ProtectedRoute requiredPermission="view_color">
              <Colores />
            </ProtectedRoute>
          }
        />
        <Route
          path="descripciones"
          element={
            <ProtectedRoute requiredPermission="view_descripcion">
              <Descripciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="notificaciones"
          element={
            <ProtectedRoute requiredPermission="view_notificacion">
              <Notificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="preguntas"
          element={
            <ProtectedRoute requiredPermission="view_preguntas">
              <Preguntas />
            </ProtectedRoute>
          }
        />
        <Route
          path="prendas"
          element={
            <ProtectedRoute requiredPermission="view_prenda">
              <Prendas />
            </ProtectedRoute>
          }
        />
        <Route
          path="tallas"
          element={
            <ProtectedRoute requiredPermission="view_talla">
              <Tallas />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredPermission="view_user">
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="grupos"
          element={
            <ProtectedRoute requiredPermission="view_group">
              <Grupos />
            </ProtectedRoute>
          }
        />
        <Route
          path="permisos"
          element={
            <ProtectedRoute requiredPermission="view_permission">
              <Permisos />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
