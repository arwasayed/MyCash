// // utils/openaiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getFinancialAdvice(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Mycash, an Egyptian financial advisor bot.
                    Speak in colloquial Egyptian Arabic.
                    Use only the context provided below.
                    Keep replies short and cheerful.`
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("OpenAI Error:", error.message);
    return "مش قادر أجاوبك دلوقتي، برجاء المحاولة لاحقاً.";
  }
}

module.exports = { getFinancialAdvice };