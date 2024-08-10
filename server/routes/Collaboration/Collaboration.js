const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");
const uuid = require("uuid");

//collab req
router.post("/collab/sentreq", auth, async (req, res) => {
  try {
    const { userid, note, title } = req.body;
    //console.log(req.body);
    const insertdata = await pool.query(
      "INSERT INTO t_collabrequest(sentfrom, sentto, note, reqsenttime,status) VALUES ($1, $2, $3,CURRENT_TIMESTAMP,'P')",
      [req.user, userid, note]
    );

    const sendNotification = await pool.query(
      "INSERT INTO t_notification(sentfrom, sendto, title, message, readreceipt)VALUES ($1, $2, $3, $4, false) RETURNING notifyid",
      [req.user, userid, title, note]
    );
    res.json({
      status: "success",
      message: "Collaboration Request Sent Successfully!!",
      notifyid: sendNotification.rows[0].notifyid,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
//pending req (Requests sent by me i.e logged in user)
router.get("/collab/pending", auth, async (req, res) => {
  try {
    const pendingreq = await pool.query(
      "select t2.usersrl,t2.userid,t2.username,t2.userimage,t1.status from t_collabrequest t1 left join m_user t2 on t1.sentto=t2.usersrl where t1.sentfrom=$1 and t1.status='P'",
      [req.user]
    );
    res.json(pendingreq.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//pending req (Recieved reqs wrt logged in user)
router.get("/collab/recv/pending", auth, async (req, res) => {
  try {
    const pendingreq = await pool.query(
      "select t2.usersrl,t2.userid,t2.username,t2.userimage,t1.status from t_collabrequest t1 left join m_user t2 on t1.sentfrom=t2.usersrl where t1.sentto=$1 and t1.status='P'",
      [req.user]
    );
    res.json(pendingreq.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//connections
router.get("/collab/recv/connections", auth, async (req, res) => {
  try {
    const pendingreq = await pool.query(
      "select t2.usersrl,t2.userid,t2.username,t2.userimage,t1.status from t_collabrequest t1 left join m_user t2 on t1.sentfrom=t2.usersrl where t1.sentto=$1 and t1.status='C'",
      [req.user]
    );
    res.json(pendingreq.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
//accept req
router.put("/collab/accept", auth, async (req, res) => {
  try {
    const { userid } = req.body;
    //console.log(req.body);
    const update = await pool.query(
      "update t_collabrequest set status='C' where sentfrom=$1 and sentto=$2 RETURNING note,reqsenttime",
      [userid, req.user]
    );
    const insertreverserecord = await pool.query(
      "INSERT INTO t_collabrequest(sentfrom, sentto, note, reqsenttime,status) VALUES ($1, $2, $3,$4,'C')",
      [req.user, userid, update.rows[0].note, update.rows[0].reqsenttime]
    );
    res.json({
      status: "success",
      message: "Accepted!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
//decline req
router.put("/collab/decline", auth, async (req, res) => {
  try {
    const { userid } = req.body;
    //console.log(req.body);
    const update = await pool.query(
      "update t_collabrequest set status='D' where sentfrom=$1 and sentto=$2",
      [userid, req.user]
    );
    res.json({
      status: "success",
      message: "Declined!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
module.exports = router;
