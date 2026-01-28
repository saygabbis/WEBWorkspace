import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/client.js";

export function Layout({ children }) {
  const { token, setToken } = useApi();
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    setToken("");
    navigate("/login");
  };

  const isLogin = location.pathname.startsWith("/login");

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="logo">Gabbis Workspace</span>
          {!isLogin && (
            <nav className="app-nav">
              <Link to="/guilds">Servidores</Link>
            </nav>
          )}
        </div>
        <div className="app-header-right">
          {token && !isLogin ? (
            <button className="btn-secondary" onClick={onLogout}>
              Sair
            </button>
          ) : null}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

