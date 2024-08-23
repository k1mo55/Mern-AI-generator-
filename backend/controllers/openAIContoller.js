import OpenAI from "openai";
import ContentHistory from "../models/ContentHistory.js";
import User from "../models/User.js";

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
              { role: "user", content: `generate a blog post for ${prompt} without genrating a title` }
          ],
          max_tokens: 5
      });

      console.log(completion.choices[0].message.content.trim());
      const content = completion.choices[0].message.content.trim();
      const user = await User.findById( req.userId );
      const History = await ContentHistory.create ({
        user:user._id ,
        content:content
      })   
      user.history.push(History._id);
      user.apiRequestCount +=1;
      await user.save();
      console.log(user)
      console.log(History)
      res.status(200).json(content);
  } catch (err) {
      res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  openAIController
}