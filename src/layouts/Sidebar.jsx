import { NavLink, useNavigate } from "react-router-dom";
import { useContext, cloneElement } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";
import { logoutUser } from "@/services/auth/logout";
import { RiGitRepositoryPrivateFill, RiShutDownLine } from "react-icons/ri";
import {
  FaHouseUser,
  FaTable,
  FaPalette,
  FaCommentDots,
  FaBell,
  FaQuestion,
  FaTshirt,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";

import "./css/Sidebar.css";
import ModalLateral from "./ModalLateral.jsx";
import Swal from "sweetalert2";

const Sidebar = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y deberás volver a iniciar sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
          await logoutUser(refresh_token);
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    }
  };

  if (loading) return null;

  return (
    <>
      <ModalLateral />
      <div className="sidebar-container">
        <div
          id="sidebar"
          className="flex-column"
          style={{ backgroundColor: "#1b1b1b" }}
        >
          <NavLink to="/" className="text-center py-3">
            <img
              src="/img/logo.png"
              alt="logo"
              className="mt-n1"
              style={{ width: "65px" }}
            />
          </NavLink>
          <hr className="text-white bg-white mb-1 mx-2 border-2 my-0" />

          {renderLink("/", "Dashboard", <FaHouseUser />)}
          {hasPermission(user, "view_categoria") &&
            renderLink("/categorias", "Categorías", <FaTable />)}
          {hasPermission(user, "view_color") &&
            renderLink("/colores", "Colores", <FaPalette />)}
          {hasPermission(user, "view_descripcion") &&
            renderLink("/descripciones", "Descripci..", <FaCommentDots />)}
          {hasPermission(user, "view_notificacion") &&
            renderLink("/notificaciones", "Notificaci..", <FaBell />)}
          {hasPermission(user, "view_preguntas") &&
            renderLink("/preguntas", "Preguntas", <FaQuestion />)}
          {hasPermission(user, "view_prenda") &&
            renderLink("/prendas", "Prendas", <FaTshirt />)}
          {hasPermission(user, "view_talla") &&
            renderLink("/tallas", "Tallas", <FaTags />)}
          {hasPermission(user, "view_user") &&
            renderLink("/usuarios", "Usuarios", <FaUser />)}
          {hasPermission(user, "view_group") &&
            renderLink("/grupos", "Grupos", <MdGroups />)}
          {hasPermission(user, "view_permission") &&
            renderLink("/permisos", "Permisos", <RiGitRepositoryPrivateFill />)}

          <div className="position-sticky pt-1 mt-auto card-menu" style={{backgroundColor: "#1b1b1b", bottom: "0px" }}>
          <button
              onClick={handleLogout}
              className="mb-1 p-1 text-center border px-2"
              style={{ backgroundColor: "#2d2d2d", }}
            >
              <RiShutDownLine className="simbolo-icon-sm mt-n1" />
              <p className="pt-2 text-white text-menu">Cierre</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function renderLink(to, label, icon) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `my-1 p-1 text-center card-menu mx-2 ${isActive ? "active-link" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {icon &&
            cloneElement(icon, {
              color: isActive ? "#f6a0a0" : "",
              className: "simbolo-icon",
            })}
          <p className="pt-2 text-white text-menu">{label}</p>
          <span className={isActive ? "selector" : "no-selector"}></span>
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;
