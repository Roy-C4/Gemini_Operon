const express = require("express");
const app = express();
const cors = require("cors");
// const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "25mb" })); //Access req.body or request.body
app.use(express.urlencoded({ extended: true }));
//app.use (express.static(path.join(__dirname,"client/build")));
//ROUTES
app.use("/operon/api/v1/user", require("./routes/LoginRoutes/UserLogin"));
app.use("/operon/api/v1/user", require("./routes/PostRoutes/UserPost"));
app.use("/operon/api/v1/user", require("./routes/DashBoard/UserDasboard"));
app.use("/operon/api/v1/user", require("./routes/Recommendation/RecentIdeas"));
app.use("/operon/api/v1/user", require("./routes/GenerateiveAI/GenerateiveAI"));
app.use("/operon/api/v1/user", require("./routes/Rating/Rating"));
app.use("/operon/api/v1/user", require("./routes/Collaboration/Collaboration"));
app.use("/operon/api/v1/user", require("./routes/Notification/Notification"));
app.use("/operon/api/v1/user", require("./routes/Chat/Chat"));
// app.get("*", (req,res) => {
//   res.sendFile(path.join(__dirname,"client/build/index.html"));
// })
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
