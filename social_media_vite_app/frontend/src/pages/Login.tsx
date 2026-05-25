import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

interface LoginProps {
  onLogin: (username: string, userId: number) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      const response = await client.post("/auth/login", null, {
        params: { username: username.trim() },
      });
      const { user_id, username: returnedName } = response.data;
      onLogin(returnedName, user_id);
      navigate("/feed");
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to connect to backend server. Please make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      padding: "2rem 1rem",
      background: "radial-gradient(circle at top, var(--accent-bg), transparent)"
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%",
        background: "var(--social-bg)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        boxShadow: "var(--shadow)",
        backdropFilter: "blur(12px)",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          margin: "0 0 0.5rem 0",
          background: "linear-gradient(45deg, var(--accent), #ff75c3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          letterSpacing: "-1px"
        }}>
          SocioSpire
        </h1>
        <p style={{ color: "var(--text)", marginBottom: "2rem" }}>
          Welcome! Experience a fast, password-less social platform.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ textAlign: "left" }}>
            <label htmlFor="username-input" style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-h)",
              marginBottom: "0.5rem"
            }}>
              Choose a username
            </label>
            <input
              id="username-input"
              type="text"
              placeholder="e.g., alex_star"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-h)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, var(--accent), #7c3aed)",
              color: "white",
              border: "none",
              padding: "0.9rem",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? "Connecting..." : "Let's Go!"}
          </button>
        </form>
      </div>
    </div>
  );
}
