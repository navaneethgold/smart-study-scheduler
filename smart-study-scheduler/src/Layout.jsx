import Sidebar from "./boilerplate/sidebar";
import { Outlet } from "react-router-dom";
import "./App.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}