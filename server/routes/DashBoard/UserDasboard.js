const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");
const uuid = require("uuid");

//logined user
router.get("/userdetails", auth, async (req, res) => {
  try {
    const user = await pool.query(
      "select  username, userimage,age, emailid,about, TO_CHAR(date,'dd-MM-yyyy') as date from m_user where usersrl=$1",
      [req.user]
    );
    // console.log(req.expiry)
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//other user
router.get("/otherdetails/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "select  userid,usersrl,username, userimage,age, emailid,about, TO_CHAR(date,'dd-MM-yyyy') as date from m_user where userid=$1",
      [id]
    );
    // console.log(req.expiry)
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//logind user's
router.get("/recentideas", auth, async (req, res) => {
  try {
    const recentideas = await pool.query(
      "SELECT t1.*, t2.* FROM t_ideas t1 JOIN m_bizcategory t2 ON t1.categoryarray @> ARRAY[t2.catgid] WHERE t1.usersrl=$1",
      [req.user]
    );
    const uniqueIdeas = {};

    recentideas.rows.forEach((item) => {
      if (!uniqueIdeas[item.ideasrl]) {
        uniqueIdeas[item.ideasrl] = {
          ideasrl: item.ideasrl,
          ideaid: item.ideaid,
          description: item.description,
          gist: item.gist,
          usersrl: item.usersrl,
          title: item.title,
          category: [],
        };
      }
      uniqueIdeas[item.ideasrl].category.push({
        catgid: item.catgid,
        catgname: item.catgname,
      });
    });

    const result = Object.values(uniqueIdeas);
    // console.log(req.expiry)
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//other user's
router.get("/recentideas/others/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const recentideas = await pool.query(
      "SELECT t1.*, t2.* FROM t_ideas t1 JOIN m_bizcategory t2 ON t1.categoryarray @> ARRAY[t2.catgid] join m_user t3 on t1.usersrl=t3.usersrl WHERE t3.userid=$1",
      [id]
    );
    const uniqueIdeas = {};

    recentideas.rows.forEach((item) => {
      if (!uniqueIdeas[item.ideasrl]) {
        uniqueIdeas[item.ideasrl] = {
          ideasrl: item.ideasrl,
          ideaid: item.ideaid,
          description: item.description,
          gist: item.gist,
          usersrl: item.usersrl,
          title: item.title,
          category: [],
        };
      }
      uniqueIdeas[item.ideasrl].category.push({
        catgid: item.catgid,
        catgname: item.catgname,
      });
    });

    const result = Object.values(uniqueIdeas);
    // console.log(req.expiry)
    res.json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//contact from
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contactInsert = await pool.query(
      "INSERT INTO t_contactus(name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.json({
      type: "success",
      message: "Your respose has been recorded successfully!!",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
module.exports = router;
