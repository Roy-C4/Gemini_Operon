const express = require("express");
const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middlewares/Auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
//CREATE CHAT
router.post("/chat/chatcreate", authorization, async (req, res) => {
  try {
    const { receiverid } = req.body;
    // const created_date = new Date().toISOString();
    const checkchat = await pool.query(
      "SELECT chatid, members FROM m_chat WHERE members @> ARRAY[$1::bigint, $2::bigint]",
      [req.user, receiverid]
    );
    if (checkchat.rows.length > 0) {
      res.json(checkchat.rows);
    } else {
      const createchat = await pool.query(
        "INSERT INTO m_chat (members) VALUES (ARRAY[$1::bigint, $2::bigint]) RETURNING *",
        [req.user, receiverid]
      );
      res.json(createchat.rows);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error!");
  }
});
//GET ALL CHATS
router.get("/chat/allchat", authorization, async (req, res) => {
  try {
    const getchat = await pool.query(
      "SELECT c.chatid, c.members, c.createdat, u.usersrl,u.userimage,u.username FROM m_chat c LEFT JOIN m_user u ON u.usersrl = ANY(c.members) WHERE $1::bigint = ANY(c.members)",
      [req.user]
    );
    const allchats = getchat.rows;
    const filterarray = allchats.filter((opt) => opt.usersrl !== req.user);
    res.json(filterarray);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//GET A SPECIFIC CHAT
router.get("/chat/specchat/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      "SELECT c.chatid,c.members,c.createdat, u.usersrl,u.userimage,u.username FROM m_chat c LEFT JOIN m_user u ON u.usersrl = ANY(c.members) WHERE chatid=$1",
      [id]
    );
    const allchats = data.rows;
    const filterarray = allchats.filter((opt) => opt.usersrl !== req.user);
    res.json(filterarray);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

////////////////////////////////// MESSAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//CREATE MESSAGE
router.post("/chat/message", authorization, async (req, res) => {
  try {
    const { chatid, message } = req.body;
    console.log(message);
    // Fetch the AI model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { response_mime_type: "application/json" },
    });
    //NSFW CHECK
    const nsfwcheckprompt = `please read this message and determine if it discusses any potentially harmful, sexually explicit, or suicidal content or nsfw.It should return a json in following format which will only decide if it's offensive or not. The message is ${message}.use the Following JSON schema :
        { "type": "object",
  "properties": {
    "message": { "type": "string" },
    "Return": { "type": "boolean" },
  }
}`;
    console.log(nsfwcheckprompt);
    const nsfwresult = await model.generateContent(nsfwcheckprompt);
    const nsfwresponse = await nsfwresult.response;
    const nsfwjson = JSON.parse(nsfwresponse.text().toString());
    console.log(nsfwjson);
    if (nsfwjson.Return === false) {
      console.warn("IM IN RESPONSE IF");
      // Get the current timestamp with timezone
      const timestamp = new Date().toISOString();
      const createmessage = await pool.query(
        "INSERT INTO m_message (chatid, senderid, message, timestamp) VALUES ($1, $2, $3, $4) RETURNING chatid,senderid,message,TO_CHAR(timestamp, 'DD-MM-YYYY HH24:MI AM') AS timestamp",
        [chatid, req.user, message, timestamp]
      );
      const responseObject = {
        chatid: createmessage.rows[0].chatid,
        senderid: createmessage.rows[0].senderid,
        message: createmessage.rows[0].message,
        timestamp: createmessage.rows[0].timestamp,
      };
      res.status(200).json(responseObject);
    } else {
      console.log("IM IN RESPONSE ELSE");
      res.json({
        chatid: null,
        message: "Message not suitable for Chat",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      chatid: null,
      message: error.message,
    });
    // if (
    //   error.message ===
    //   "[GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY"
    // ) {
    //   const { chatid, message } = req.body;
    //   const timestamp = new Date().toISOString();
    //   const createmessage = await pool.query(
    //     "INSERT INTO m_message (chatid, senderid, message, timestamp,flagged) VALUES ($1, $2, $3, $4 ,$5) RETURNING chatid,senderid,message,TO_CHAR(timestamp, 'DD-MM-YYYY HH24:MI AM') AS timestamp",
    //     [chatid, req.user, "*****", timestamp, true]
    //   );
    //   const responseObject = {
    //     chatid: createmessage.rows[0].chatid,
    //     senderid: createmessage.rows[0].senderid,
    //     message: createmessage.rows[0].message,
    //     timestamp: createmessage.rows[0].timestamp,
    //   };
    //   res.status(200).json(responseObject);
    // } else {
    //   console.error(error.message);
    //   res.status(500).send("Internal Server Error!");
    // }
  }
});
//GET WHOLE Messages
router.get("/chat/allmessage/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const allchats = await pool.query(
      "SELECT messageid, chatid, senderid, message, TO_CHAR(timestamp, 'DD-MM-YYYY HH24:MI AM') AS timestamp FROM m_message WHERE chatid = $1",
      [id]
    );
    res.json(allchats.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//////////////////////////////END OF MESSAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
module.exports = router;
