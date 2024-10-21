import React, { useEffect, useState } from 'react';

function App() {
  const [msgType, setMsgType] = useState('');
  const [milestoneCode, setMilestoneCode] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [apiResponse, setApiResponse] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState(null);
  const [availableDomains, setAvailableDomains] = useState([]); 
  const [availableLevels, setAvailableLevels] = useState([]); 
  const [hoverStatus, setHoverStatus] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const validateMsgType = () => {
    const validationError = {};
    if (!msgType) {
      validationError.msgType = 'Message Type is required!';
      setValidationErrors(validationError);
      return validationError.msgType;
    }
  };

  const sendRequest = async () => {
    if (validateMsgType()) {
      return;
    }
    const requestBody = {
      message: msgType,
      code: milestoneCode,
      domain: selectedDomain,
      level: selectedLevel,
    };

    const res = await fetch('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    debugger;
    if (res.ok) {
      setApiResponse(data);
      setErrorMsg(''); 
    } else {
      setApiResponse([]);
      setErrorMsg(`Error: ${data.error}`);
    }
  };

  const fetchDomainsAndLevels = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/domainsAndLevels', {
        method: 'GET',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error('Failed to fetch domains and levels');
      }
      setAvailableDomains(data.domains);
      setAvailableLevels(data.levels);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDomainsAndLevels();
  }, []);

  const handleChangeMsgType = (e) => {
    setValidationErrors(null);
    setMilestoneCode("");
    setSelectedDomain("");
    setSelectedLevel("");
    setApiResponse([]);
    setMsgType(e.target.value);  
  };

  const appStyles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: 'center',
      padding: '40px',
      maxWidth: '600px',
      margin: 'auto',
      backgroundColor: '#f4f4f9',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '30px',
    },
    formControl: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%',
    },
    input: {
      padding: '12px',
      margin: '10px 0',
      width: '90%',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    select: {
      padding: '12px',
      margin: '10px 0',
      width: '90%',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
      marginTop: '20px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    buttonActive: {
      backgroundColor: '#004085',
    },
    tableContainer: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      borderBottom: '2px solid #ddd',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
    },
    td: {
      borderBottom: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center',
    },
    errorMessage: {
      color: 'red',
      marginTop: '10px',
    },
    noDataMessage: {
      color: '#999',
      marginTop: '20px',
      fontSize: '1.1rem',
    },
  };

  return (
    <div style={appStyles.container}>
      <h1 style={appStyles.header}>Milestone Lookup</h1>

      <div style={appStyles.formControl}>
        <label>Message Type</label>
        <select
          style={appStyles.select}
          value={msgType}
          onChange={handleChangeMsgType}
        >
          <option value="">Select Message Type</option>
          <option value="Lookup Milestone">Lookup Milestone</option>
          <option value="List Domain">List Domain</option>
        </select>
        {validationErrors?.msgType && <p style={appStyles.errorMessage}>{validationErrors.msgType}</p>}
      </div>

      {msgType ? (
        msgType === 'Lookup Milestone' ? (
          <div style={appStyles.formControl}>
            <input
              style={appStyles.input}
              type="text"
              value={milestoneCode}
              onChange={(e) => setMilestoneCode(e.target.value)}
              placeholder="Enter milestone code"
            />
          </div>
        ) : (
          <div style={appStyles.formControl}>
            <label>Domain</label>
            <select
              style={appStyles.select}
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option value="">Select Domain</option>
              {availableDomains.map((domainOption, index) => (
                <option key={index} value={domainOption}>
                  {domainOption}
                </option>
              ))}
            </select>

            <label>Level</label>
            <select
              style={appStyles.select}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              {availableLevels.map((levelOption, index) => (
                <option key={index} value={levelOption}>
                  {levelOption}
                </option>
              ))}
            </select>
          </div>
        )
      ) : (
        <p style={appStyles.noDataMessage}>No Milestone selected</p>
      )}

      <button
        style={{
          ...appStyles.button,
          ...(hoverStatus ? appStyles.buttonHover : {}),
          ...(buttonActive ? appStyles.buttonActive : {}),
        }}
        onMouseEnter={() => setHoverStatus(true)}
        onMouseLeave={() => setHoverStatus(false)}
        onMouseDown={() => setButtonActive(true)}
        onMouseUp={() => setButtonActive(false)}
        onClick={sendRequest}
      >
        Send Request
      </button>

      {apiResponse.length > 0 ? (
        <div style={appStyles.tableContainer}>
          <table style={appStyles.table}>
            <thead>
              <tr>
                <th style={appStyles.th}>Skill Code</th>
                <th style={appStyles.th}>Level</th>
                <th style={appStyles.th}>Domain</th>
                <th style={appStyles.th}>Milestone</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.map((item, index) => (
                <tr key={index}>
                  <td style={appStyles.td}>{item['Skill_Code']}</td>
                  <td style={appStyles.td}>{item.Level}</td>
                  <td style={appStyles.td}>{item.Domain}</td>
                  <td style={appStyles.td}>{item.Milestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : errorMsg ? (
        <p style={appStyles.errorMessage}>{errorMsg}</p>
      ) : (
        <p style={appStyles.noDataMessage}>No data found</p>
      )}
    </div>
  );
}

export default App;
