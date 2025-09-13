
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return (
      <div className="App">
        {showRegister ? (
          <Register onRegister={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={setToken} />
        )}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Go to Login' : 'Register'}
        </button>
      </div>
    );
  }

  return <Dashboard token={token} />;
}

export default App;
