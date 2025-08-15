import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <div className="padding-menu">
      <Sidebar />
      <div className="" style={{ minHeight: "100vh"}}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
