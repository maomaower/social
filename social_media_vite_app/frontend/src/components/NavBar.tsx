import { Link, useNavigate } from "react-router-dom";

interface NavBarProps {
  username: string | null;
  onLogout: () => void;
}

export default function NavBar({ username, onLogout }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg)",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/feed" onClick={(e) => { if (window.location.pathname === '/feed') window.location.reload(); }} style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "var(--text-h)",
          textDecoration: "none",
          background: "linear-gradient(45deg, var(--accent), #ff75c3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SocioSpire
        </Link>
        {username && (
          <Link to="/feed" onClick={(e) => { if (window.location.pathname === '/feed') window.location.reload(); }} style={{
            color: "var(--text)",
            textDecoration: "none",
            fontSize: "0.95rem"
          }}>
            Feed
          </Link>
        )}
      </div>

      {username ? (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to="/profile" style={{
            color: "var(--text-h)",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.95rem",
            borderBottom: "2px solid transparent",
            transition: "border-color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}>
            @{username}
          </Link>
          <button 
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
            style={{
              background: "var(--accent-bg)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "var(--accent-bg)";
              e.currentTarget.style.color = "var(--accent)";
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" style={{
          color: "var(--accent)",
          textDecoration: "none",
          fontSize: "0.95rem",
          fontWeight: 500
        }}>
          Login
        </Link>
      )}
    </nav>
  );
}
