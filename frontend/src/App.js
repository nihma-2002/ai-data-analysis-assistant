import { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check backend health
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("Backend not reachable");
      });
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload CSV to backend
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AI-Powered Data Analysis Assistant</h1>

      <p>
        <strong>Backend status:</strong> {backendStatus}
      </p>

      <hr />

      <h3>Upload CSV File</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload & Analyze</button>

      {loading && <p>Analyzing data...</p>}

      {analysisResult && (
        <>
          <hr />

          {/* Dataset Overview */}
          <h2>Dataset Overview</h2>
          <p><strong>Rows:</strong> {analysisResult.rows}</p>
          <p><strong>Columns:</strong> {analysisResult.columns}</p>

          {/* Column Types */}
          <h2>Column Types</h2>
          <p>
            <strong>Numeric Columns:</strong>{" "}
            {analysisResult.numeric_columns.join(", ")}
          </p>
          <p>
            <strong>Categorical Columns:</strong>{" "}
            {analysisResult.categorical_columns.join(", ")}
          </p>

          {/* Missing Values */}
          <h2>Missing Values (%)</h2>
          <ul>
            {Object.entries(analysisResult.missing_values_percent)
              .filter(([_, value]) => value > 0)
              .map(([column, value]) => (
                <li key={column}>
                  {column}: {value}%
                </li>
              ))}
          </ul>

          {/* Summary Statistics */}
          <h2>Summary Statistics</h2>
          {Object.keys(analysisResult.summary_statistics).map((column) => (
            <div key={column} style={{ marginBottom: "20px" }}>
              <h4>{column}</h4>
              <table border="1" cellPadding="6">
                <tbody>
                  {Object.entries(
                    analysisResult.summary_statistics[column]
                  ).map(([stat, value]) => (
                    <tr key={stat}>
                      <td><strong>{stat}</strong></td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
