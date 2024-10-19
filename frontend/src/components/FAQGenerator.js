import React, { useState } from "react";
import styles from "./FAQGenerator.module.css";

function FAQGenerator() {
  const [productDescription, setProductDescription] = useState("");
  const [faqs, setFaqs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/generate-faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate FAQs");
      }

      const data = await response.json();
      setFaqs(data.faqs);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate FAQs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI-Powered FAQ Generator</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="productDescription" className={styles.label}>
          Product Description
        </label>
        <textarea
          id="productDescription"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Enter your product description here..."
          required
          className={styles.textarea}
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Generating..." : "Generate FAQs"}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {faqs && (
        <div className={styles.faqsContainer}>
          <h3 className={styles.faqsTitle}>Generated FAQs:</h3>
          <pre className={styles.faqsContent}>{faqs}</pre>
        </div>
      )}
    </div>
  );
}

export default FAQGenerator;
