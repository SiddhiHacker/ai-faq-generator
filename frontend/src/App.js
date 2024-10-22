import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import FAQGenerator from "./components/FAQGenerator";
import ExportPage from "./components/ExportPage";
import "./App.css";

export default function App() {
  const onDragEnd = (result) => {
    // This function will be passed down to FAQGenerator
    // The actual reordering logic will be handled in FAQGenerator
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FAQGenerator onDragEnd={onDragEnd} />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </div>
      </Router>
    </DragDropContext>
  );
}
