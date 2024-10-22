import React from "react";
import { useDrag } from "react-dnd";
import styles from "./FAQGenerator.module.css";

function DraggableFAQ({ id, question, answer, index, handleEdit }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "faq",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      className={`${styles.faqItem} ${isDragging ? styles.dragging : ""}`}
    >
      <h4 className={styles.faqQuestion}>{question}</h4>
      <p className={styles.faqAnswer}>{answer}</p>
      <button onClick={() => handleEdit(index)} className={styles.editButton}>
        Edit
      </button>
    </li>
  );
}

export default DraggableFAQ;
