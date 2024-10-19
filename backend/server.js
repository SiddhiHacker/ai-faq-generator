const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { generateFAQs } = require("./groqAI");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the AI-Powered FAQ Generator API" });
});

app.post("/generate-faqs", async (req, res) => {
  try {
    const { productDescription } = req.body;
    if (!productDescription) {
      return res.status(400).json({ error: "Product description is required" });
    }
    const faqs = await generateFAQs(productDescription);
    res.json({ faqs });
  } catch (error) {
    console.error("Error in /generate-faqs:", error);
    res.status(500).json({ error: "Failed to generate FAQs" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
