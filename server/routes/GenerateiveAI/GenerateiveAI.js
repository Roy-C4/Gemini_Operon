const router = require("express").Router();
const auth = require("../../middlewares/Auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");
// var multer = require("multer");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



router.get("/hello", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generation_config: { response_mime_type: "application/json" },
    });

    const prompt = "Summarize the story of Blue Lock Anime.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
