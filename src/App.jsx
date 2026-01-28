import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ApiProvider, useApi } from "./api/client.js";
import { LoginPage } from "./pages/LoginPage.jsx";
import { GuildListPage } from "./pages/GuildListPage.jsx";
import { GuildDetailPage } from "./pages/GuildDetailPage.jsx";
import { Layout } from "./components/Layout.jsx";

function RequireAuth({ children }) {
  const { token } = useApi();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return (
    <ApiProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/guilds"
            element={
              <RequireAuth>
                <GuildListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/guilds/:guildId"
            element={
              <RequireAuth>
                <GuildDetailPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/guilds" replace />} />
        </Routes>
      </Layout>
    </ApiProvider>
  );
}

