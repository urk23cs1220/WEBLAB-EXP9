// src/Register.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';

function Register({ onSwitchView }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    
    axios.post("http://localhost:7000/api/register", {
      fullName, email, username, password, confirmPassword
    })
      .then((res) => {
        setMessage(res.data.message);
        if (res.data.message === "Registration successful! Please login.") {
          // Automatically switch to login view on success
          setTimeout(() => onSwitchView('login'), 2000);
        }
      })
      .catch(err => {
        setMessage("An error occurred during registration.");
        console.log(err);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 card bg-light" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Create Account</h1>
        <form onSubmit={handleRegister}>
          <input placeholder="Full Name" value={fullName} className="form-control mb-3" required onChange={(e) => setFullName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} className="form-control mb-3" required onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Username" value={username} className="form-control mb-3" required onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} className="form-control mb-3" required onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} className="form-control mb-3" required onChange={(e) => setConfirmPassword(e.target.value)} />
          
          <button type="submit" className="btn btn-success btn-lg w-100">Register</button>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          Already have an account? 
          <button 
            className="btn btn-link p-0 ms-1" 
            onClick={() => onSwitchView('login')}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;