import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('Login exitoso');
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/usuarios'); // redirigir después del login
    } else {
      setMensaje(data.message || 'Error de login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>
      <div className="mb-3">
        <label>Contraseña</label>
        <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit" className="btn btn-primary">Ingresar</button>
    </form>
  );
};

export default LoginForm;
