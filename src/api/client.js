import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const ApiContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STORAGE_KEY = "gabbis_panel_token";

export function ApiProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || "");

  const saveToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      window.localStorage.setItem(STORAGE_KEY, newToken);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const request = useCallback(
    async (path, { method = "GET", body, requireAuth = true } = {}) => {
      const headers = {
        "Content-Type": "application/json",
      };

      if (requireAuth) {
        if (!token) {
          throw new Error("Sem token configurado no painel.");
        }
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Erro HTTP ${res.status}`);
      }

      return data;
    },
    [token]
  );

  const value = useMemo(
    () => ({
      token,
      setToken: saveToken,
      apiBaseUrl: API_BASE_URL,
      request,
    }),
    [token, saveToken, request]
  );

  // Evita JSX dentro de arquivo .js para não confundir o parser do Vite
  return React.createElement(ApiContext.Provider, { value }, children);
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error("useApi deve ser usado dentro de ApiProvider");
  }
  return ctx;
}

