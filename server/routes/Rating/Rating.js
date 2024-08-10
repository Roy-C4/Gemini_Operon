const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");
const uuid = require("uuid");

router.post("/idea/rating", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { ideaid } = req.body;
    // CHECK if user has already liked the idea
    const checkdata = await client.query(
      "SELECT ratingsrl FROM t_rating WHERE likeduserid=$1 AND ideaid=$2",
      [req.user, ideaid]
    );
    if (checkdata.rows.length > 0) {
      console.log("user already praised the idea!");
      res.json({
        type: "error",
        message: "idea praised already!",
      });
    } else {
      // INSERT THE PRAISE
      const insertpraise = await client.query(
        "INSERT INTO t_rating (ideaid,likeduserid) VALUES ($1,$2)",
        [ideaid, req.user]
      );
      res.json({
        type: "success",
        message: "you can fill the praise button!",
      });
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  } finally {
    client.release();
  }
});
//dislike
router.post("/idea/dislike", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { ideaid } = req.body;

    //CHECK if user has already liked the idea
    const checklike = await client.query(
      "SELECT ratingsrl FROM t_rating WHERE likeduserid=$1 AND ideaid=$2",
      [req.user, ideaid]
    );
    if (checklike.rows.length > 0) {
      //UPDATE DATA
      const updateresponse = await client.query(
        "UPDATE t_rating SET likeduserid=$1,dislikeduserid=$2 WHERE ideaid=$3",
        [null, req.user, ideaid]
      );
      res.json({
        type:"success",
        message:"dislike updated!"
      })
    } else {
      // CHECK if user has already disliked the idea
      const checkdata = await client.query(
        "SELECT ratingsrl FROM t_rating WHERE dislikeduserid=$1 AND ideaid=$2",
        [req.user, ideaid]
      );
      if (checkdata.rows.length > 0) {
        console.log("user already disliked the idea!");
        res.json({
          type: "error",
          message: "idea disliked already!",
        });
      } else {
        // INSERT THE PRAISE
        const insertrejected = await client.query(
          "INSERT INTO t_rating (ideaid,dislikeduserid) VALUES ($1,$2)",
          [ideaid, req.user]
        );
        res.json({
          type: "success",
          message: "you can fill the dislike button!",
        });
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  } finally {
    client.release();
  }
});
module.exports = router;
