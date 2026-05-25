import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = async (name: string) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", null, {
        params: { username: name },
      });
      setUsername(res.data.username);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/feed"
        element={
          username ? <Feed username={username} /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to={username ? "/feed" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
