import React from "react";
import FAQGenerator from "./components/FAQGenerator";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered FAQ Generator</h1>
      </header>
      <main>
        <FAQGenerator />
      </main>
    </div>
  );
}

export default App;
