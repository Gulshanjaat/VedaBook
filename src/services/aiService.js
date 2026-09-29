const client = require("../config/openai");

const generateAnswer = async (context, question) => {
  try {
    console.log("========== AI SERVICE ==========");
    console.log("CONTEXT LENGTH:", context.length);
    console.log("QUESTION:", question);

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
You are an AI assistant for a PDF question-answering application.

IMPORTANT RULES:

1. Answer ONLY using the information available in the uploaded documents.
2. Do NOT use your general knowledge.
3. Do NOT make up or guess information.
4. If the answer cannot be found in the uploaded documents, reply exactly:
Answer not found.

UPLOADED DOCUMENTS:

${context}

USER QUESTION:

${question}
`,

      config: {
        maxOutputTokens: 500,
      },
    });

    console.log("GEMINI RESPONSE RECEIVED");

    return {
      answer: response.text || "Answer not found.",
      tokens: 0,
    };
  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.log(error);

    throw error;
  }
};

module.exports = {
  generateAnswer,
};