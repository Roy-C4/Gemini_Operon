const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");
const uuid = require("uuid");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
router.get("/bizcatg", auth, async (req, res) => {
  try {
    const ideacatg = await pool.query("select * from m_bizcategory");
    // console.log(req.expiry)
    res.json(ideacatg.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});

router.post(
  "/postidea",
  auth,
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    try {
      const { description, gist, categoryarray, title } = req.body;
      console.log(gist);
      // Fetch the AI model
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { response_mime_type: "application/json" },
      });
      //NSFW CHECK
      const nsfwcheckprompt = `please read this paragraph mentioned as Gist and determine if it discusses any potentially harmful, sexually explicit, suicidal content or nsfwReturn should be either true or false explicitly.The paragraph is ${gist}. use the Following JSON schema: 
       { "type": "object",
  "properties": {
    "message": { "type": "string" },
    "Return": { "type": "boolean" },
  }
}`;
      console.log(nsfwcheckprompt);
      const nsfwresult = await model.generateContent(nsfwcheckprompt);
      const nsfwresponse = await nsfwresult.response;
      console.log(nsfwresponse.text());
      const nsfwjson = JSON.parse(nsfwresponse.text().toString());
      console.log(nsfwjson);
      if (nsfwjson.Return === true) {
        return res.json({
          type: "error",
          message: `Content Not Suitable For Posting!`,
        });
      }
      if (nsfwjson.Return === false) {
        const newcategoryarray = JSON.parse(categoryarray);
        // Ensure categoryarray is an array
        const catgs = newcategoryarray.map((opt) => opt.catgid);

        const newIdeaId = uuid.v4();

        // Fetch existing ideas from the database
        const ideas = await pool.query(
          "SELECT IDEAID,DESCRIPTION AS GIST, USERSRL FROM T_IDEAS WHERE USERSRL != $1",
          [req.user]
        );

        // Prepare the prompt for the AI model
        const prompt = `
          Return the data as specified and this is not a coding solution I am asking.
          I want you to compare the following 'gist' of the object provided with each 'gist' in the array of objects using contextual similarity matching of texts
          and return a similarity score out of 10 for each comparison.
          The score should indicate how similar the gists are, where 10 means extremely similar and 1 means not similar at all.
          The return format must be in json. Don't return any idea with similarity score less than 8 or that doesn't match the context.

          Articles = {'gist': str, 'usersrl': int, 'score': float, 'ideaid': str}
          Return: list[Articles];

          Here is the Article Object that should be matched against array:
          {
            "gist": "${description}",
            "usersrl": "${req.user}"
          }

          And array of object is:
          ${JSON.stringify(ideas.rows, null, 2)}
        `;

        // Generate content based on the prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        const jsonData = JSON.parse(text.toString());
        console.log(jsonData);
        // // Extract the JSON string from the text
        // const jsonString = text.match(/```json\s+([\s\S]+?)\s+```/)[1];

        // // Parse the JSON string into a JavaScript object
        // const jsonData = JSON.parse(jsonString);
        // console.log(jsonData);
        // Get the uploaded files
        // console.log(req.files.file1);
        // console.log(req.files.file2);
        const file1 = req.files.file1 ? req.files.file1[0].buffer : null;
        const file2 = req.files.file2 ? req.files.file2[0].buffer : null;
        const file1name = req.files.file1
          ? req.files.file1[0].originalname
          : null;
        const file2name = req.files.file2
          ? req.files.file2[0].originalname
          : null;
        const file1mimetype = req.files.file1
          ? req.files.file1[0].mimetype
          : null;
        const file2mimetype = req.files.file2
          ? req.files.file2[0].mimetype
          : null;
        // Save the new idea to the database, including the files
        const postidea = await pool.query(
          "INSERT INTO t_ideas(ideaid, description, gist, usersrl, categoryarray, title, file1, file2,file1name,file2name,file1mimetype,file2mimetype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12) RETURNING ideaid, usersrl",
          [
            newIdeaId,
            description,
            gist,
            req.user,
            catgs,
            title,
            file1,
            file2,
            file1name,
            file2name,
            file1mimetype,
            file2mimetype,
          ]
        );
        const postedusersrl = postidea.rows[0].usersrl;
        const postedideaid = postidea.rows[0].ideaid;

        for (let i = 0; i < jsonData.length; i++) {
          const newrecommendationid = uuid.v4();
          const insertrecommendations = await pool.query(
            "INSERT INTO t_recommendations (recid, usersrl, score, ideaid, rejected) VALUES ($1, $2, $3, $4, false)",
            [
              newrecommendationid,
              req.user,
              jsonData[i].score,
              jsonData[i].ideaid,
            ]
          );
          const insertreverserecommendations = await pool.query(
            "INSERT INTO t_recommendations (recid, usersrl, score, ideaid, rejected) VALUES ($1, $2, $3, $4, false)",
            [
              newrecommendationid,
              jsonData[i].usersrl,
              jsonData[i].score,
              postedideaid,
            ]
          );
        }

        // Send the parsed JSON object as the API response
        res.json({
          type: "success",
          message: "Idea Posted Successfully!!",
        });
      } else {
        res.json({ type: "error", message: "Something is Wrong!" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ type: "error", message: `${error.message}` });
    }
  }
);
module.exports = router;
