import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./FAQGenerator.module.css";
import { faqTemplates } from "../faqTemplates";

export default function FAQGenerator({ onDragEnd }) {
  const [productDescription, setProductDescription] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const navigate = useNavigate();

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
      const parsedFaqs = parseFaqs(data.faqs);
      setFaqs(parsedFaqs);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate FAQs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseFaqs = (faqString) => {
    const faqPairs = faqString.split("\n\n");
    return faqPairs.map((pair, index) => {
      const [question, answer] = pair.split("\n");
      return { id: `faq-${index}`, question, answer };
    });
  };

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    if (template) {
      setFaqs(faqTemplates[template]);
    } else {
      setFaqs([]);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index, updatedQuestion, updatedAnswer) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      question: updatedQuestion,
      answer: updatedAnswer,
    };
    setFaqs(updatedFaqs);
    setEditingIndex(-1);
  };

  const handleCancel = () => {
    setEditingIndex(-1);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("http://localhost:5000/export-faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faqs, format: "html" }),
      });

      if (!response.ok) {
        throw new Error("Failed to export FAQs");
      }

      const exportedData = await response.text();
      navigate("/export", { state: { exportedData, format: "html" } });
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to export FAQs. Please try again.");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFaqs(items);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI-Powered FAQ Generator</h2>
      <div className={styles.columns}>
        <div className={styles.inputColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="template" className={styles.label}>
              Select a template (optional):
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className={styles.select}
            >
              <option value="">Custom (No template)</option>
              <option value="ecommerce">E-commerce</option>
              <option value="software">Software</option>
              <option value="restaurant">Restaurant</option>
            </select>
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
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Generating..." : "Generate FAQs"}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.previewColumn}>
          <h3 className={styles.previewTitle}>Live Preview</h3>
          <div className={styles.previewContent}>
            {faqs.length > 0 ? (
              <>
                <Droppable droppableId="faqs">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={styles.faqList}
                    >
                      {faqs.map((faq, index) => (
                        <Draggable
                          key={faq.id}
                          draggableId={faq.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${styles.faqItem} ${
                                snapshot.isDragging ? styles.dragging : ""
                              }`}
                            >
                              {editingIndex === index ? (
                                <div className={styles.editForm}>
                                  <input
                                    type="text"
                                    defaultValue={faq.question}
                                    className={styles.editInput}
                                    ref={(input) => input && input.focus()}
                                  />
                                  <textarea
                                    defaultValue={faq.answer}
                                    className={styles.editTextarea}
                                  />
                                  <div className={styles.editButtons}>
                                    <button
                                      onClick={() =>
                                        handleSave(
                                          index,
                                          document.querySelector(
                                            `.${styles.editInput}`
                                          ).value,
                                          document.querySelector(
                                            `.${styles.editTextarea}`
                                          ).value
                                        )
                                      }
                                      className={styles.saveButton}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancel}
                                      className={styles.cancelButton}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h4 className={styles.faqQuestion}>
                                    {faq.question}
                                  </h4>
                                  <p className={styles.faqAnswer}>
                                    {faq.answer}
                                  </p>
                                  <button
                                    onClick={() => handleEdit(index)}
                                    className={styles.editButton}
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
                <div className={styles.exportButtons}>
                  <button
                    onClick={handleExport}
                    className={styles.exportButton}
                  >
                    Export as HTML
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.emptyPreview}>
                Generated FAQs will appear here. Select a template or enter a
                product description and click "Generate FAQs" to get started.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
