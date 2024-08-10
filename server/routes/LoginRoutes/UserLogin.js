const express = require("express");
const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../../utils/jwtToken");
const uuid = require("uuid");
const auth = require("../../middlewares/Auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", upload.single("imageFile"), async (req, res) => {
  try {
    const { username, password, email, dob } = req.body;
    console.log(req.file);
    const imageFile = req.file.buffer;

    // Calculate age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    const checkexistinguser = await pool.query(
      "SELECT usersrl FROM m_user WHERE username=$1",
      [username]
    );

    if (checkexistinguser.rows.length > 0) {
      res.json({
        status: "error",
        message: "The username is already taken!",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      const newUserUuid = uuid.v4();
      await pool.query(
        "INSERT INTO m_user (userid, username, password, usertypeid, userimage, age, emailid, date, about, dob) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 'I am new in OPERON', $8)",
        [newUserUuid, username, secPass, 2, imageFile, age, email, dob]
      );

      res.json({
        status: "success",
        message: "User Registered Successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    //1.Check if user exists
    const checkusrename = await pool.query(
      "SELECT usersrl,userid,password,usertypeid FROM m_user WHERE username=$1",
      [username]
    );
    if (checkusrename.rowCount > 0) {
      const userid = checkusrename.rows[0].usersrl;
      const usertype = checkusrename.rows[0].usertypeid;
      const checkValidPass = await bcrypt.compare(
        password,
        checkusrename.rows[0].password
      );
      console.log(checkValidPass);
      if (checkValidPass) {
        const token = jwtGenerator(
          userid,
          parseInt(usertype) === 2 ? "U" : parseInt(usertype) === 3 ? "I" : "A"
        );
        res.json({
          type: "success",
          message: "Login Successful!",
          uid: userid,
          token,
          usertype:
            parseInt(usertype) === 2
              ? "U"
              : parseInt(usertype) === 3
              ? "I"
              : "A",
        });
      } else {
        return res.status(401).json({
          type: "error",
          message: "Username or Password is incorrect!",
        });
      }
    } else {
      return res.status(401).json({
        type: "error",
        message: "Username or Password is incorrect!",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

//VERIFY JWT USING MIDDLEWARE
router.get("/login/verify", auth, async (req, res) => {
  try {
    res.json({
      authstatus: true,
      utype: req.userType,
      uid: req.user,
    });
  } catch (err) {
    res.status(500).send("server Error");
  }
});

//edit profile--details
router.post("/edit/profile/details", auth, upload.none(), async (req, res) => {
  try {
    const { about, username } = req.body;
    console.log(req.body);
    const updateData = await pool.query(
      "UPDATE m_user SET username=$1,about=$2 WHERE usersrl=$3",
      [username, about, req.user]
    );

    res.json({
      status: "success",
      message: "User Updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error!");
  }
});

//edit profile--avatar
router.post(
  "/edit/profile/avatar",
  upload.single("imageFile"),
  auth,
  async (req, res) => {
    try {
      const imageFile = req.file.buffer;
      const updateAvatar = await pool.query(
        "UPDATE m_user set userimage=$1 where usersrl=$2",
        [imageFile, req.user]
      );

      res.json({
        status: "success",
        message: "User Updated Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error!");
    }
  }
);
module.exports = router;
