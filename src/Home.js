import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Home() {
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const history = useHistory();

  const handleEnterpriseSelect = (e) => {
    setSelectedEnterprise(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (selectedEnterprise) {
      // Redirect to login page with selected enterprise as a query parameter
      history.push('/login');
    } else {
      // Show error or prompt to select an enterprise
      alert('Please select an enterprise.');
    }
  };
  

  return (
    <div>
      <h1>Welcome to Home</h1>
      <p>Select your enterprise:</p>
      <select value={selectedEnterprise} onChange={handleEnterpriseSelect}>
        <option value="">Select Enterprise</option>
        <option value="mspharma">MS Pharma</option>
        <option value="joswe">Joswe</option>
        {/* Add more options for other enterprises if needed */}
      </select>
      <br />
      <button onClick={(e) => handleLogin(e)}>Login</button>

    </div>
  );
}

export default Home;
