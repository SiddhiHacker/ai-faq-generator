const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateFAQs(productDescription) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that generates FAQs based on product descriptions.",
          },
          {
            role: "user",
            content: `Generate 5 frequently asked questions and answers based on the following product description: ${productDescription}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating FAQs:", error);
    throw new Error("Failed to generate FAQs");
  }
}

module.exports = { generateFAQs };
