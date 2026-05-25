import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on start
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setUserId(parseInt(storedUserId, 10));
    }
    setLoading(false);
  }, []);

  const handleLogin = (name: string, id: number) => {
    setUsername(name);
    setUserId(id);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", id.toString());
  };

  const handleLogout = () => {
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading session...
      </div>
    );
  }

  return (
    <>
      <NavBar username={username} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            username ? <Navigate to="/feed" replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/feed"
          element={
            username && userId ? (
              <Feed username={username} userId={userId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            username && userId ? (
              <Profile username={username} userId={userId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={username ? "/feed" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
