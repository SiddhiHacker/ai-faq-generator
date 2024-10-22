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

app.post("/export-faqs", (req, res) => {
  try {
    const { faqs, format } = req.body;

    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({ error: "Invalid FAQs data" });
    }

    if (format === "json") {
      res.json(faqs);
    } else if (format === "html") {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Exported FAQs</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .faq-item { margin-bottom: 20px; }
            .faq-question { font-weight: bold; color: #2c3e50; }
            .faq-answer { margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Frequently Asked Questions</h1>
          ${faqs
            .map(
              (faq) => `
            <div class="faq-item">
              <p class="faq-question">Q: ${faq.question}</p>
              <p class="faq-answer">A: ${faq.answer}</p>
            </div>
          `
            )
            .join("")}
        </body>
        </html>
      `;
      res.header("Content-Type", "text/html");
      res.send(htmlContent);
    } else {
      res.status(400).json({ error: "Invalid export format" });
    }
  } catch (error) {
    console.error("Error in /export-faqs:", error);
    res.status(500).json({ error: "Failed to export FAQs" });
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
