import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
 import './FormDataComponent.css'
function FormDataComponent() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      const enterpriseID = localStorage.getItem('enterpriseID');
      const response = await axios.get(`https://api.stg-qms.scigeniq.io/QMS/api/1.0.0/form/search/${enterpriseID}?noAcl=true&start=0&length=100&user=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setFormData(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
    setLoading(false);
  };

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Form Data');

    // Add headers
    worksheet.addRow(['Template Name', 'Question Name', 'Question Type', 'Folder Name']);

    // Add data rows
    formData.forEach((form) => {
      form.groups.forEach((group) => {
        group.questions.forEach((question) => {
          worksheet.addRow([
            form.title.en,
            question.name.en,
            question.type,
            question.folderSettings?.folderTypeId?.name || '',
          ]);
        });
      });
    });

    // Generate a blob from the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create a blob from the buffer
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'form_data.xlsx'; // File name
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="container">
      <button id='excel' onClick={downloadExcel} disabled={!formData.length}>Download Excel ⬇️</button>

      {/* Display error message if there's an error */}
      {error && <div className="error">{error}</div>}

      {/* Display data in a table */}
      {formData.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Question Name</th>
                <th>Question Type</th>
                <th>Folder Name</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((form, index) => (
                form.groups.map((group, groupIndex) => (
                  group.questions.map((question, questionIndex) => (
                    <tr key={`${index}-${groupIndex}-${questionIndex}`}>
                      <td>{form.title.en}</td>
                      <td>{question.name.en}</td>
                      <td>{question.type}</td>
                      <td>{question.folderSettings?.folderTypeId?.name}</td>
                    </tr>
                  ))
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display message if no data is available */}
      {!loading && formData.length === 0 && <div className="error">No data available.</div>}
    </div>
  );
}

export default FormDataComponent;
