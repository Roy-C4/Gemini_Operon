const router = require("express").Router();
const pool = require("../../db");
const auth = require("../../middlewares/Auth");

router.post("/notification/send", auth, async (req, res) => {
  try {
    const { sendto, title, message } = req.body;
    // console.log(req.body);

    const sendNotification = await pool.query(
      "INSERT INTO t_notification(sentfrom, sendto, title, message, readreceipt) VALUES ($1, $2, $3, $4, false)",
      [req.user, sendto, title, message]
    );
    res.json({
      type: "sucess",
      message: "Request Send Sucessfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
//pending
router.get("/notification/allnotifications", auth, async (req, res) => {
  try {
    const allnotifications = await pool.query(
      "SELECT t1.notifyid, t1.sentfrom, t1.sendto, t1.title, t1.message as detail, t1.readreceipt,t2.username as receievedfromname from t_notification t1 left join m_user t2 on  t1.sentfrom=t2.usersrl where sendto=$1",
      [req.user]
    );
    //unreadcount
    const unreadnotifications = await pool.query(
      "SELECT COUNT(*) as unreadcount from t_notification where sendto=$1 and readreceipt=false",
      [req.user]
    );
    res.json({
      allnotifications: allnotifications.rows,
      unreadcount: unreadnotifications.rows[0].unreadcount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
//read receipt
router.put("/notification/read/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const readNotifications = await pool.query(
      "UPDATE t_notification set readreceipt=true where notifyid=$1",
      [id]
    );
    res.json({ type: "success", message: "updated!!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});
module.exports = router;
