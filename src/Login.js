import React, { useState } from 'react';
import axios from 'axios';
import FormDataComponent from './FormDataComponent'; // Import FormDataComponent here

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enterpriseID, setEnterpriseID] = useState(localStorage.getItem('enterpriseID') || ''); // Load enterprise ID from localStorage
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const handleLogin = async () => {
    try {
      // Perform login and get the access token
      const response = await axios.post(`https://api.stg-qms.scigeniq.io/QMS/api/1.0.0/user/login/${enterpriseID}`, {
        username,
        password,
      });
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      // Get user info to retrieve the user ID
      const userId = await getUserInfo(accessToken);
      localStorage.setItem('userId', userId);
      setError('');
      setIsLoggedIn(true); // Set login status to true
      onLogin();
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      // Fetch user info using the access token
      const response = await axios.get('https://api.stg-qms.scigeniq.io/QMS/api/1.0.0/userInfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data._id;
    } catch (error) {
      throw new Error('Error fetching user info');
    }
  };

  const handleEnterpriseChange = (e) => {
    const selectedEnterprise = e.target.value;
    setEnterpriseID(selectedEnterprise);
    localStorage.setItem('enterpriseID', selectedEnterprise); // Save selected enterprise to localStorage
  };

  // Render the FormDataComponent if isLoggedIn is true
  if (isLoggedIn) {
    return <FormDataComponent />;
  }

  // Otherwise, render the login form
  return (
    <div>
      <h2>Login</h2>
      <label htmlFor="enterpriseID">Select Enterprise:</label>
      <select required id="enterpriseID" value={enterpriseID} onChange={handleEnterpriseChange}>
        <option value="">Select Enterprise</option>
        <option value="mspharma">MS Pharma</option>
        <option value="joswe">joswe</option>
        {/* Add more options for other enterprises if needed */}
      </select>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <div>{error}</div>}
    </div>
  );
}

export default Login;
