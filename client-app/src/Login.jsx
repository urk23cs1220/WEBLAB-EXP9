// src/Login.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess, onSwitchView }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    axios.post("http://localhost:7000/api/login", { usernameOrEmail, password })
      .then((res) => {
        if (res.data.message === "Login successful") {
          // Pass user data up to App.jsx
          onLoginSuccess(res.data.user);
        } else {
          setMessage(res.data.message);
        }
      })
      .catch(err => {
        setMessage("An error occurred during login.");
        console.log(err);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 card bg-light" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">✈️ Travel Planner Login</h1>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username or Email"
            value={usernameOrEmail}
            className="form-control mb-3"
            required
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="form-control mb-3"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-lg w-100">Login</button>
        </form>
        {message && <p className="text-danger text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          Don't have an account? 
          <button 
            className="btn btn-link p-0 ms-1" 
            onClick={() => onSwitchView('register')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;