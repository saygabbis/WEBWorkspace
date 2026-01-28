import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../api/client.js";

export function GuildListPage() {
  const { request } = useApi();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await request("/guilds");
        if (!cancelled) {
          setGuilds(res.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Erro ao carregar servidores.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [request]);

  return (
    <div className="page">
      <h1>Servidores</h1>
      {loading && <p>Carregando...</p>}
      {error && <div className="alert-error">{error}</div>}
      {!loading && !error && guilds.length === 0 && (
        <p className="muted">O bot não está em nenhum servidor (ou ainda está inicializando).</p>
      )}
      <div className="grid">
        {guilds.map((g) => (
          <Link key={g.id} to={`/guilds/${g.id}`} className="card card-link">
            <h2>{g.name}</h2>
            <p className="muted">ID: {g.id}</p>
            <p>
              Proteções: <strong>{g.protectionsCount}</strong>
            </p>
            <p>
              Soundboard: <strong>{g.soundboardCount}</strong> sons
            </p>
            <p>Logs: {g.hasCommandLogs ? "Configurados" : "Não configurados"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

