import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/client.js";

export function LoginPage() {
  const { setToken } = useApi();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/guilds";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: input.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Token inválido");
      }
      setToken(input.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-centered">
      <h1>Painel Gabbis</h1>
      <p className="muted">
        Informe o <code>PANEL_TOKEN</code> configurado no backend.
      </p>
      <form onSubmit={handleSubmit} className="form-vertical">
        <label>
          Token do painel
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: 988137617..."
          />
        </label>
        {error && <div className="alert-error">{error}</div>}
        <button className="btn-primary" type="submit" disabled={loading || !input.trim()}>
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

