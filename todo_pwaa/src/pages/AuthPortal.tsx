import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuth } from "../api";

type Face = "login" | "register";

function initialFace(): Face {
  return window.location.pathname.includes("register") ? "register" : "login";
}

export default function AuthPortal() {
  const nav = useNavigate();
  const [face, setFace] = useState<Face>(initialFace);
  const [flipping, setFlipping] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okPulse, setOkPulse] = useState(false);

  function flipTo(next: Face) {
    if (flipping || next === face) return;
    setError("");
    setFlipping(true);
    setFace(next);
    // Actualiza URL sin remount / sin reiniciar animaciones de React Router
    window.history.replaceState(null, "", next === "register" ? "/register" : "/");

    window.setTimeout(() => setFlipping(false), 900);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = face === "login" ? "/auth/login" : "/auth/register";
      const body =
        face === "login" ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, body);
      localStorage.setItem("token", data.token);
      setAuth(data.token);
      setOkPulse(true);
      setTimeout(() => nav("/dashboard"), 550);
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo continuar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal">
      <div className="portal-space" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="grid-fade" />
      </div>

      {/* Flotación en wrapper externo — no se toca al girar */}
      <div className={`portal-float ${okPulse ? "is-success" : ""}`}>
        <div className="portal-stage">
          <div
            className={`portal-card ${face === "register" ? "is-back" : ""} ${flipping ? "is-flipping" : ""}`}
          >
            <div className="portal-face portal-face--front">
              <div className="portal-brand">
                <div className="portal-core" aria-hidden="true" />
                <h1>To-Do</h1>
              </div>
              <form className="portal-form" onSubmit={onSubmit}>
                <input
                  type="email"
                  placeholder="correo"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="portal-pass">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="clave"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShow((s) => !s)}>
                    {show ? "●" : "○"}
                  </button>
                </div>
                {error && face === "login" && (
                  <p className="portal-error">{error}</p>
                )}
                <button className="portal-go" disabled={loading} type="submit">
                  {loading ? "…" : "Entrar"}
                </button>
              </form>
              <button
                type="button"
                className="portal-switch"
                onClick={() => flipTo("register")}
              >
                Crear cuenta →
              </button>
            </div>

            <div className="portal-face portal-face--back">
              <div className="portal-brand portal-brand--alt">
                <div className="portal-core portal-core--alt" aria-hidden="true" />
                <h1>Alta</h1>
              </div>
              <form className="portal-form" onSubmit={onSubmit}>
                <input
                  placeholder="nombre"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="correo"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="portal-pass">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="clave"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button type="button" onClick={() => setShow((s) => !s)}>
                    {show ? "●" : "○"}
                  </button>
                </div>
                {error && face === "register" && (
                  <p className="portal-error">{error}</p>
                )}
                <button
                  className="portal-go portal-go--alt"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "…" : "Crear"}
                </button>
              </form>
              <button
                type="button"
                className="portal-switch"
                onClick={() => flipTo("login")}
              >
                ← Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
