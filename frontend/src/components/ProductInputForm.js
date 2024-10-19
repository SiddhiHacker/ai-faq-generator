import React, { useState } from "react";
import "./ProductInputForm.css";

const ProductInputForm = ({ onSubmit }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
      setDescription("");
    } else {
      alert("Please enter a product description.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-input-form">
      <label htmlFor="description">Product Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter product description here..."
        required
      />
      <button type="submit">Generate FAQ</button>
    </form>
  );
};

export default ProductInputForm;
