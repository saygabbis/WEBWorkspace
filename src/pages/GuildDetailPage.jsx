import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../api/client.js";

export function GuildDetailPage() {
  const { guildId } = useParams();
  const { request } = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savingNarrador, setSavingNarrador] = useState(false);
  const [savingSoundboard, setSavingSoundboard] = useState(false);
  const [narradorToggle, setNarradorToggle] = useState(false);
  const [maxDurationInput, setMaxDurationInput] = useState("");
  const [volumeInput, setVolumeInput] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await request(`/guilds/${guildId}`);
      setData(res.data);
      setNarradorToggle(res.data.config.narradorSayUser);
      setMaxDurationInput(String(res.data.config.maxSoundDuration ?? ""));
      setVolumeInput(String(res.data.config.soundboardVolume ?? ""));
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao carregar servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const handleSaveNarrador = async () => {
    try {
      setSavingNarrador(true);
      await request(`/guilds/${guildId}/narrador`, {
        method: "PATCH",
        body: { enabled: narradorToggle },
      });
      await load();
    } catch (err) {
      alert(err.message || "Erro ao salvar configuração do narrador.");
    } finally {
      setSavingNarrador(false);
    }
  };

  const handleSaveSoundboard = async () => {
    try {
      setSavingSoundboard(true);
      const body = {};
      if (maxDurationInput.trim() !== "") {
        body.maxDuration = Number(maxDurationInput);
      }
      if (volumeInput.trim() !== "") {
        body.volume = Number(volumeInput);
      }
      await request(`/guilds/${guildId}/soundboard/settings`, {
        method: "PATCH",
        body,
      });
      await load();
    } catch (err) {
      alert(err.message || "Erro ao salvar configurações de soundboard.");
    } finally {
      setSavingSoundboard(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert-error">{error}</div>
        <button className="btn-secondary" onClick={load}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { guild, config, blacklist, soundboard, stats } = data;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{guild.name || guild.id}</h1>
          <p className="muted">ID: {guild.id}</p>
        </div>
        <Link to="/guilds" className="btn-secondary">
          Voltar
        </Link>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <h2>Proteções</h2>
          <p>
            Total de proteções: <strong>{stats.totalProtections}</strong>
          </p>
          <p>
            Ativações: <strong>{stats.totalActivations}</strong> • Desconexões:{" "}
            <strong>{stats.totalDisconnects}</strong>
          </p>
          {config.protections.length === 0 ? (
            <p className="muted">Nenhuma proteção configurada.</p>
          ) : (
            <details>
              <summary>Ver lista</summary>
              <ul className="list">
                {config.protections.map((p, idx) => (
                  <li key={idx}>
                    <code>{p.targetId}</code> protegido de <code>{p.triggerId}</code> — modo{" "}
                    <strong>{p.mode || "instant"}</strong>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <section className="card">
          <h2>Blacklist</h2>
          <p>
            Usuários completamente bloqueados: <strong>{blacklist.users.length}</strong>
          </p>
          <p>
            Usuários com comandos bloqueados:{" "}
            <strong>{Object.keys(blacklist.commands).length}</strong>
          </p>
          <details>
            <summary>Ver resumo</summary>
            <div className="stack">
              {blacklist.users.length > 0 && (
                <div>
                  <h3>Usuários bloqueados</h3>
                  <ul className="list">
                    {blacklist.users.map((u) => (
                      <li key={u}>
                        <code>{u}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(blacklist.commands).length > 0 && (
                <div>
                  <h3>Comandos por usuário</h3>
                  <ul className="list">
                    {Object.entries(blacklist.commands).map(([uid, cmds]) => (
                      <li key={uid}>
                        <code>{uid}</code>:{" "}
                        {cmds.map((c) => (
                          <code key={c} className="pill">
                            /{c}
                          </code>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        </section>

        <section className="card">
          <h2>Narrador</h2>
          <label className="switch-row">
            <span>Falar nome do usuário antes da mensagem</span>
            <input
              type="checkbox"
              checked={narradorToggle}
              onChange={(e) => setNarradorToggle(e.target.checked)}
            />
          </label>
          <button
            className="btn-primary"
            onClick={handleSaveNarrador}
            disabled={savingNarrador}
          >
            {savingNarrador ? "Salvando..." : "Salvar"}
          </button>
        </section>

        <section className="card">
          <h2>Soundboard</h2>
          <p>
            Sons cadastrados: <strong>{soundboard.count}</strong>
          </p>
          <div className="form-vertical">
            <label>
              Duração máxima (segundos)
              <input
                type="number"
                min="1"
                value={maxDurationInput}
                onChange={(e) => setMaxDurationInput(e.target.value)}
              />
            </label>
            <label>
              Volume (%)
              <input
                type="number"
                min="1"
                max="200"
                value={volumeInput}
                onChange={(e) => setVolumeInput(e.target.value)}
              />
            </label>
          </div>
          <button
            className="btn-primary"
            onClick={handleSaveSoundboard}
            disabled={savingSoundboard}
          >
            {savingSoundboard ? "Salvando..." : "Salvar"}
          </button>

          {soundboard.sounds.length > 0 && (
            <details style={{ marginTop: "1rem" }}>
              <summary>Ver sons</summary>
              <ul className="list">
                {soundboard.sounds.map((s) => (
                  <li key={s.id}>
                    {s.emoji ? `${s.emoji} ` : ""}
                    <strong>{s.name}</strong> — {s.duration?.toFixed(1) ?? "?"}s
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <section className="card">
          <h2>Logs</h2>
          {config.commandLogs ? (
            <>
              <p>
                Canal: <code>{config.commandLogs.channelId}</code>
              </p>
              <p>
                Tipo: <strong>{config.commandLogs.type}</strong>
              </p>
              {Array.isArray(config.commandLogs.commands) && (
                <p>
                  Comandos:{" "}
                  {config.commandLogs.commands.map((c) => (
                    <code key={c} className="pill">
                      /{c}
                    </code>
                  ))}
                </p>
              )}
            </>
          ) : (
            <p className="muted">Nenhum log configurado.</p>
          )}
          <p className="muted small">
            Configuração detalhada de logs (tipo/canal/comandos) pode ser feita via comandos
            slash ou pelos endpoints da API.
          </p>
        </section>
      </div>
    </div>
  );
}

