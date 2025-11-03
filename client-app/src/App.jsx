// src/App.jsx
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the components
import Login from './Login';
import Register from './Register';
import Planner from './Planner';

function App() {
  // 'view' can be 'login', 'register', or 'planner'
  const [view, setView] = useState('login');
  // 'loggedInUser' will store the user's data after login
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function to handle successful login
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setView('planner');
  };

  // Function to handle logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setView('login');
  };

  // Function to switch between login and register views
  const handleSwitchView = (newView) => {
    setView(newView);
  };

  // Conditional Rendering:
  // Show the correct component based on the 'view' state
  
  if (view === 'planner') {
    return <Planner user={loggedInUser} onLogout={handleLogout} />;
  }
  
  if (view === 'register') {
    return <Register onSwitchView={handleSwitchView} />;
  }

  // Default view is 'login'
  return <Login onLoginSuccess={handleLoginSuccess} onSwitchView={handleSwitchView} />;
}

export default App;