import React, { useState } from 'react';
import Login from './Login';
import FormDataComponent from './FormDataComponent';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const handleLogin = (token) => {
    setAccessToken(token);
    // Force a rerender by updating a dummy state
    // setForceUpdate(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('enterpriseID');
    setAccessToken(null);
  };

  return (
    <div>
      {accessToken ? (
        <button id='logout' onClick={handleLogout}>Logout</button>
      ) : null}
      {!accessToken ? (
        <Login onLogin={handleLogin} />
      ) : (
        <FormDataComponent accessToken={accessToken} />
      )}
    </div>
  );
}

export default App;
