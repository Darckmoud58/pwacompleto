import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, setAuth } from './api';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [token] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );

  useEffect(() => {
    if (!token) return;
    setAuth(token);
    api
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setAuth(null);
        navigate('/login', { replace: true });
      });
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  function logout() {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login', { replace: true });
  }

  return (
    <main className="app">
      <h1>Todo PWA</h1>
      <p>
        Sesión iniciada
        {user?.name ? `: ${user.name}` : ''}
        {user?.email ? ` (${user.email})` : ''}
      </p>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default App;
