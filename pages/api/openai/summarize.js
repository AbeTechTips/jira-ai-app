import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Missing or empty text input" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that summarizes technical support tickets.",
        },
        {
          role: "user",
          content: `Summarize this Jira issue: ${text}`,
        },
      ],
    });

    const summary = chatCompletion.choices?.[0]?.message?.content || "No summary generated";
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return res.status(500).json({
      message: "OpenAI API error",
      error: error?.message || "Unknown error",
    });
  }
}
