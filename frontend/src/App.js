import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("Backend not reachable"));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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

  const renderChart = (chartName, chartConfig) => {
    const chartData = Object.entries(chartConfig.data).map(
      ([label, value]) => ({
        label,
        value,
      })
    );

    return (
      <div key={chartName} style={{ marginBottom: "40px" }}>
        <h4>{chartName}</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
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

          <h2>Dataset Overview</h2>
          <p><strong>Rows:</strong> {analysisResult.rows}</p>
          <p><strong>Columns:</strong> {analysisResult.columns}</p>

          <h2>Charts</h2>
          {Object.entries(analysisResult.charts).map(
            ([chartName, chartConfig]) =>
              renderChart(chartName, chartConfig)
          )}
        </>
      )}
    </div>
  );
}

export default App;
