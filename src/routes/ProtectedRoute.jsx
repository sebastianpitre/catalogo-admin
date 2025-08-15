import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

const ProtectedRoute = ({ requiredPermission, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    console.warn("Sin permisos para ver esta ruta:", requiredPermission);
    return <Navigate to="/403" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
