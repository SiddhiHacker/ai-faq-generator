import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ExportPage.module.css";

function ExportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [exportedData, setExportedData] = useState("");

  useEffect(() => {
    if (location.state?.exportedData) {
      setExportedData(location.state.exportedData);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleDownload = () => {
    const blob = new Blob([exportedData], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faqs.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedData).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Exported FAQs (HTML)</h2>
      <div className={styles.buttonContainer}>
        <button onClick={handleDownload} className={styles.button}>
          Download
        </button>
        <button onClick={handleCopy} className={styles.button}>
          Copy to Clipboard
        </button>
        <button onClick={() => navigate("/")} className={styles.button}>
          Back to Generator
        </button>
      </div>
      <div className={styles.codeContainer}>
        <h3>HTML Code:</h3>
        <pre className={styles.code}>
          <code>{exportedData}</code>
        </pre>
      </div>
      <div className={styles.previewContainer}>
        <h3>Preview:</h3>
        <iframe
          title="HTML Preview"
          srcDoc={exportedData}
          className={styles.htmlPreview}
        />
      </div>
    </div>
  );
}

export default ExportPage;
