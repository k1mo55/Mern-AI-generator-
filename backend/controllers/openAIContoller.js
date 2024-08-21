import OpenAI from "openai";


const openAIController = async (req, res) => {
  try {
      const openai = new OpenAI({
          apiKey: process.env.OPENAI_SECRET_KEY
      });

      const { prompt } = req.body;

      if (!prompt) {
          return res.status(400).json({ message: "Prompt is required" });
      }

      const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              { role: "user", content: `generate a blog post for ${prompt}` }
          ],
          max_tokens: 10
      });

      console.log(completion);
      res.status(200).json(completion);
  } catch (err) {
      res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  openAIController
}