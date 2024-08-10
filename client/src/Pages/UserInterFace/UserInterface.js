import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import SendIcon from "@mui/icons-material/Send";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { FaHandsClapping } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Recommendation from "../../Components/SkeletonComponents/Recommendation";
import { toast, ToastContainer } from "react-toastify";
import { MdFileDownload } from "react-icons/md";
import gemini from "../../Assets/Google_Gemini_logo.png";
//driverjs import
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../../Css/DriverJs.css";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const UserInterface = ({ socket, startTour }) => {
  const [recentidea, setrecentidea] = useState([]);
  const [matchedusers, setmatchedusers] = useState([]);
  const [ideas, setideas] = useState([]);
  const [collaborators, setcollaborators] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const expandedRef = useRef(null);

  const handleExpandClick = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };
  const token = localStorage.getItem("token");
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  // GET MATCHED USERS AND RECOMMENDATIONS \\
  async function getMatchedUsers() {
    try {
      const data = await fetch("/operon/api/v1/user/recusers", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const response = await data.json();
      const byteArrayToBase64 = (byteArray) => {
        let binary = "";
        const bytes = new Uint8Array(byteArray);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

      // Process the fetched data
      const processedUsers = response.map((user) => {
        const base64Image = `data:image/jpeg;base64,${byteArrayToBase64(
          new Uint8Array(user.matcheduserimage.data)
        )}`;
        return {
          id: user.recommendeduserid,
          name: user.recommendeduser,
          avatarUrl: base64Image,
          usersrl: user.usersrl,
        };
      });

      setmatchedusers(processedUsers);
      //console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getMatchedUsers();
  }, []);

  // Focus on the expanded card when it expand
  useEffect(() => {
    if (expandedId !== null && expandedRef.current) {
      expandedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      expandedRef.current.focus();
    }
  }, [expandedId]);
  //
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = collaborators.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [age, setage] = useState("");
  const [about, setabout] = useState("");
  const [avatar, setavatar] = useState(null);
  const [loading, setloading] = useState(true);
  const [recommendationRating, setRecommandationRating] = useState([]);
  const [praiseActivate, setPraiseActivate] = useState(false);
  //my profile
  async function getuser() {
    try {
      const data = await fetch("/operon/api/v1/user/userdetails", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const res = await data.json();
      const userImageBuffer = res.userimage.data;
      const base64String = arrayBufferToBase64(userImageBuffer);
      setavatar("data:image/jpeg;base64," + base64String);
      setusername(res.username);
      setage(res.age);
      setemail(res.emailid);
      setabout(res.about);
      setloading(false);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getuser();
  }, []);

  //recent ideas
  async function getrecentideas() {
    try {
      const data = await fetch("/operon/api/v1/user/recentideas", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const res = await data.json();
      console.log("RecentIdeas", res);
      setrecentidea(res);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getrecentideas();
  }, []);

  //recommendation
  async function getrecommendation() {
    try {
      const data = await fetch("/operon/api/v1/user/recommemdations", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const res = await data.json();
      console.log("Recommendations", res);
      setideas(res);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getrecommendation();
  }, []);
  //connections
  async function getconnection() {
    try {
      const data = await fetch("/operon/api/v1/user/collab/recv/connections", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const response = await data.json();
      const byteArrayToBase64 = (byteArray) => {
        let binary = "";
        const bytes = new Uint8Array(byteArray);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

      // Process the fetched data
      const processedUsers = response.map((user) => {
        const base64Image = `data:image/jpeg;base64,${byteArrayToBase64(
          new Uint8Array(user.userimage.data)
        )}`;
        return {
          id: user.usersrl,
          name: user.username,
          avatarUrl: base64Image,
          usersrl: user.usersrl,
          status: user.status,
          userid: user.userid,
        };
      });

      setcollaborators(processedUsers);
      //console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getconnection();
  }, []);
  //praise
  const handlePraise = async (e, idea) => {
    e.preventDefault();
    try {
      const ideaid = idea.ideaid;
      const body = { ideaid };
      const data = await fetch("/operon/api/v1/user/idea/rating", {
        method: "POST",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.type === "success") {
        setideas(ideas.filter((opt) => opt.ideaid !== ideaid));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //reject idea
  const handleReject = async (e, idea) => {
    e.preventDefault();
    try {
      const ideaid = idea.ideaid;
      const body = { ideaid };
      const data = await fetch("/operon/api/v1/user/idea/dislike", {
        method: "POST",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.type === "success") {
        setideas(ideas.filter((opt) => opt.ideaid !== ideaid));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //collaboration
  const [open, setOpen] = useState(false);
  const [clickedUser, setClickedUser] = useState({});
  console.log(clickedUser);
  const [collabtext, setCollabtext] = useState("Love your idea,Lets connect!!");
  const [discollabreqbtn, setdiscollabreqbtn] = useState(false);
  const handleClickOpen = (e, user) => {
    e.preventDefault();
    setOpen(true);
    setClickedUser(user);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleReqSent = async (e, clickedUser) => {
    e.preventDefault();
    setdiscollabreqbtn(true);
    // console.log(clickedUser.usersrl);
    try {
      const body = {
        userid: clickedUser.usersrl,
        note: collabtext,
        title: "Connection Request",
      };
      const data = await fetch("/operon/api/v1/user/collab/sentreq", {
        method: "POST",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.status === "success") {
        toast.success(res.message);
        setOpen(false);
        setdiscollabreqbtn(false);
        socket.emit("sendNotes", {
          notifyid: res.notifyid,
          collabtext,
          recipientid: clickedUser.usersrl,
          receievedfromname: username,
        });
      }
    } catch (error) {
      setdiscollabreqbtn(false);
      console.log(error.message);
    }
  };

  const handleFileDownload = (fileData, fileName, type) => {
    // Step 1: Convert fileData to Uint8Array if needed
    const uint8Array = new Uint8Array(fileData);

    // Step 2: Create Blob from Uint8Array
    const blob = new Blob([uint8Array], { type });

    // Step 3: Create temporary download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Step 4: Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  };
  //explaination dialoge
  const [eopen, seteOpen] = useState(false);

  const handleClickeOpen = () => {
    seteOpen(true);
  };
  //explain the idea
  const [explaination, setexplaination] = useState("");
  const [explLoading, setexplLoading] = useState(false);
  const [explLoading2, setexplLoading2] = useState(false);
  const handleExplain = async (e, idea) => {
    try {
      console.log(idea);
      setexplLoading(true);
      setexplLoading2(true);
      const body = {
        imagedata: idea.file1.data,
        imagemime: idea.file1mimetype,
      };
      const fetchdata = await fetch("/operon/api/v1/user/explain/image", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });
      const res = await fetchdata.json();
      //console.log(res);
      setexplaination(res.content);
      seteOpen(true);
      setexplLoading(false);
      setexplLoading2(false);
    } catch (error) {
      setexplLoading(false);
      setexplLoading2(false);
      console.log(error.message);
    }
  };
  const handleeClose = () => {
    seteOpen(false);
  };
  return (
    <>
      <ToastContainer />
      {/* <Navbar /> */}
      {/* MAIN BOX START */}
      {loading && <Recommendation />}
      {!loading && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", height: "93vh" }}
        >
          {/* LEFT BOX MAIN */}
          <Box sx={{ backgroundColor: "white", height: "100%", width: "30%" }}>
            {/* UPPER LEFT BOX */}
            <Box
              id="profile"
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                height: "60%",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                mt={2}
                textAlign={"center"}
                color={"gray"}
              >
                My Profile
              </Typography>
              <Card
                sx={{
                  m: 2,
                  p: 2,
                  height: "100%",
                  width: 500,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      alt={username}
                      src={avatar}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h5" component="div" gutterBottom>
                      {username}
                    </Typography>
                    <Typography variant="body1" component="div" gutterBottom>
                      Age:{age}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Email: {email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      About: {about}
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        mt: 3,
                        fontFamily: "Rubik, sans-serif",
                        fontWeight: 600,
                        color: "#382b22",
                        textTransform: "uppercase",
                        padding: "0.75em 1.5em",
                        background: "#ffdb4d", // Updated background color
                        border: "2px solid #b18597",
                        borderRadius: "0.75em",
                        transformStyle: "preserve-3d",
                        transition:
                          "transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1)",
                        position: "relative",
                        display: "inline-block",
                        cursor: "pointer",
                        outline: "none",
                        border: 0,
                        verticalAlign: "middle",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        "&::before": {
                          position: "absolute",
                          content: '""',
                          width: "100%",
                          height: "100%",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "#e0be36", // Adjusted to match the shade for the pseudo-element
                          borderRadius: "inherit",
                          boxShadow: "0 0 0 2px #b18597, 0 0.625em 0 0 #ffd700", // Updated shadow color
                          transform: "translate3d(0, 0.75em, -1em)",
                          transition:
                            "transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1)",
                        },
                        "&:hover": {
                          background: "#ffd100", // Slightly lighter shade on hover
                          transform: "translate(0, 0.25em)",
                          "&::before": {
                            boxShadow: "0 0 0 2px #b18597, 0 0.5em 0 0 #ffd700",
                            transform: "translate3d(0, 0.5em, -1em)",
                          },
                        },
                        "&:active": {
                          background: "#ffd500", // Same shade for active state
                          transform: "translate(0em, 0.75em)",
                          "&::before": {
                            boxShadow: "0 0 0 2px #b18597, 0 0 #ffd700",
                            transform: "translate3d(0, 0, -1em)",
                          },
                        },
                      }}
                      onClick={startTour}
                    >
                      Start Tour
                    </Button>
                    {/* Add more user data fields here */}
                  </Box>
                  <Stack
                    justifyContent={"center"}
                    mt={4}
                    direction={"row"}
                    spacing={2}
                  >
                    <Typography
                      pt={0.8}
                      textAlign={"center"}
                      variant="subtitle2"
                      color="textPrimary"
                    >
                      &copy; {new Date().getFullYear()} OPERON - POWERED BY
                    </Typography>
                    <img
                      src={gemini}
                      alt="gemini"
                      style={{
                        verticalAlign: "middle",
                        width: "15%", // Adjust the width as needed
                        height: "15%", // Adjust the height as needed
                      }}
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                    }}
                  ></Box>
                </CardActions>
              </Card>
            </Box>
            {/* UPPER LEFT BOX END*/}
            {/* LOWER LEFT BOX */}
            <Box
              id="recent"
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                height: "40%",
              }}
            >
              <Typography
                variant="h5"
                mt={2}
                textAlign={"center"}
                color={"gray"}
              >
                Recent Ideas
              </Typography>
              <div style={{ height: "100%", overflowY: "auto" }}>
                {recentidea.length > 0 &&
                  recentidea.map((idea, index) => (
                    <Card
                      sx={{
                        p: 1,
                        m: 2,
                        transition: "transform 0.3s ease",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                        borderRadius: "8px",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      key={index}
                    >
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                        >
                          {idea.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {idea.gist}
                        </Typography>
                        {/* <Rating
                        name="business-rating"
                        value={idea.rating}
                        precision={0.5}
                        readOnly
                      /> */}
                        <div style={{ marginTop: "10px" }}>
                          {idea.category.map((cat, i) => (
                            <Chip
                              key={i}
                              label={cat.catgname}
                              style={{
                                marginRight: "5px",
                                marginBottom: "5px",
                              }}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {recentidea.length === 0 && (
                  <Typography
                    color={"gray"}
                    mt={5}
                    textAlign={"center"}
                    variant="body1"
                  >
                    No Ideas So Far...
                  </Typography>
                )}
              </div>
            </Box>
            {/* LOWER LEFT BOX END*/}
          </Box>
          {/* LEFT BOX MAIN END */}

          {/* MIDDLE BOX  */}
          <Box
            id="recommendation"
            sx={{ backgroundColor: "white", height: "100%", width: "50%" }}
          >
            <div style={{ height: "4%" }}>
              <Typography variant="h5" mt={1} textAlign="center" color="gray">
                Recommendations
              </Typography>
            </div>
            <div style={{ height: "95%", overflowY: "auto" }}>
              <Box sx={{ m: 1 }}>
                {ideas.length > 0 ? (
                  ideas.map((idea) => (
                    <Card
                      key={idea.ideaid}
                      sx={{
                        mb: 1,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                      }}
                      ref={expandedId === idea.ideaid ? expandedRef : null}
                    >
                      <CardContent
                        sx={{
                          position: "relative",
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          component="p"
                          variant="subtitle2"
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            marginTop: 2,
                            marginRight: 2,
                          }}
                        >
                          {parseInt(idea.rating_out_of_5)} Praise Rating Of 5
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {idea.title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          Author: {idea.recommendeduser}
                        </Typography>
                        {!expandedId || expandedId !== idea.ideaid ? (
                          <Typography variant="body1" color="textPrimary">
                            Gist: {idea.gist}
                          </Typography>
                        ) : (
                          <Collapse
                            in={expandedId === idea.ideaid}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Typography variant="body1" color="textPrimary">
                              <strong>Gist:</strong> {idea.gist}
                            </Typography>
                            <div
                              style={{
                                width: "100%",
                                height: "300px",
                                overflowY: "scroll",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                <strong>Description:</strong> {idea.description}
                              </Typography>
                              {idea.file1mimetype && idea.file2mimetype && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  component="p"
                                >
                                  <strong>Attachments:</strong>
                                </Typography>
                              )}
                              {idea.file1mimetype && (
                                <>
                                  <Chip
                                    icon={
                                      <MdFileDownload
                                        style={{ fontSize: 24 }}
                                      />
                                    }
                                    sx={{
                                      ml: 1,
                                      "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                        transition:
                                          "background-color 0.3s ease", // Add transition for hover effect
                                        boxShadow:
                                          "0px 3px 10px rgba(0,0,0,0.2)", // Example boxShadow change on hover
                                      },
                                    }}
                                    label={`${idea?.file1name}`}
                                    onClick={(e) =>
                                      handleFileDownload(
                                        idea?.file1?.data,
                                        idea?.file1name,
                                        idea?.file1mimetype
                                      )
                                    }
                                  />
                                  <Button
                                    disabled={explLoading}
                                    onClick={(e) => handleExplain(e, idea)}
                                  >
                                    {explLoading ? "Loading" : "Explain"}
                                  </Button>
                                </>
                              )}

                              {idea.file2mimetype && (
                                <>
                                  <Chip
                                    icon={
                                      <MdFileDownload
                                        style={{ fontSize: 24 }}
                                      />
                                    } // Adjust the icon size here
                                    sx={{
                                      ml: 2,
                                      "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                        transition:
                                          "background-color 0.3s ease", // Add transition for hover effect
                                        boxShadow:
                                          "0px 3px 10px rgba(0,0,0,0.2)", // Example boxShadow change on hover
                                      },
                                    }} // Add hover effect
                                    label={`${idea?.file2name}`}
                                    onClick={(e) =>
                                      handleFileDownload(
                                        idea?.file2?.data,
                                        idea?.file2name,
                                        idea?.file2mimetype
                                      )
                                    }
                                  />
                                  <Button
                                    disabled={explLoading2}
                                    onClick={(e) => handleExplain(e, idea)}
                                  >
                                    {explLoading2 ? "Loading" : "Explain"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </Collapse>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ width: "30%" }}>
                          <div style={{ marginTop: "10px" }}>
                            {idea.category.map((cat, i) => (
                              <Chip
                                key={i}
                                label={cat.catgname}
                                style={{
                                  marginRight: "5px",
                                  marginBottom: "5px",
                                }}
                              />
                            ))}
                          </div>
                        </Box>
                        <Box
                          sx={{
                            width: "70%",
                            display: "flex",
                            justifyContent: "end",
                          }}
                        >
                          <Tooltip title="Praise Idea" key={idea.ideaid}>
                            <IconButton
                              sx={{
                                color: idea.likedflag
                                  ? "#ffdb4d"
                                  : praiseActivate[idea.id]
                                  ? "#ffdb4d"
                                  : "gray",
                              }}
                              onClick={(e) => handlePraise(e, idea)}
                              size="medium"
                            >
                              <FaHandsClapping />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Idea">
                            <IconButton
                              sx={{ ml: 2 }}
                              size="medium"
                              color="error"
                              onClick={(e) => handleReject(e, idea)}
                            >
                              <ThumbDownIcon />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Report">
                            <IconButton
                              sx={{ ml: 2 }}
                              size="medium"
                              color="warning"
                            >
                              <ReportProblemIcon />
                            </IconButton>
                          </Tooltip> */}
                          {/* <Button
                            sx={{
                              mr: 2,
                              ml: 2,
                              borderRadius: 30,
                              backgroundColor: "white",
                              color: "#ff9900",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#ff9900",
                                color: "white",
                                borderColor: "white",
                              },
                            }}
                            variant="outlined"
                            color="warning"
                            size="small"
                            startIcon={<PersonAddAlt1Icon />}
                          >
                            Connect
                          </Button> */}
                          <IconButton
                            onClick={() => handleExpandClick(idea.ideaid)}
                            size="small"
                          >
                            {expandedId === idea.ideaid ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <Typography sx={{ mt: "30%" }} textAlign="center">
                    No Recommendations....Try To Post More!!
                  </Typography>
                )}
              </Box>
            </div>
          </Box>
          {/* MIDDLE BOX END*/}
          {/* RIGHT BOX MAIN */}
          <Box sx={{ backgroundColor: "red", height: "100%", width: "20%" }}>
            {/* UPPER RIGHT BOX */}
            <Box
              id={"matcheduser"}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                height: "50%",
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="h5"
                mt={2}
                textAlign={"center"}
                color={"gray"}
              >
                Matched Users
              </Typography>
              <div style={{ height: "100%", overflowY: "auto" }}>
                {matchedusers.map((user) => (
                  <Card
                    sx={{
                      m: 2,
                      height: "80px",
                      transition: "transform 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                      borderRadius: "8px",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    key={user.id}
                    variant="outlined"
                  >
                    <CardContent>
                      <ListItem>
                        <Link
                          to={`/others/${user.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItemAvatar>
                            <Avatar alt={user.name} src={user.avatarUrl} />
                          </ListItemAvatar>
                        </Link>
                        <ListItemText primary={user.name} />
                        <IconButton
                          id={user.id}
                          onClick={(e) => handleClickOpen(e, user)}
                          size="small"
                          color="warning"
                        >
                          <PersonAddAlt1Icon />
                        </IconButton>
                      </ListItem>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Box>
            {/* UPPER RIGHT BOX END*/}
            {/* LOWER RIGHT BOX */}
            <Box
              id={"collaborators"}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                height: "50%",
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="h5"
                mt={2}
                textAlign={"center"}
                color={"gray"}
              >
                Collaborators
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <input
                  style={{
                    borderRadius: "10px",
                    width: 300,
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                  }}
                  type="text"
                  placeholder="Search collaborators..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div style={{ height: "100%", overflowY: "auto" }}>
                {filteredUsers.map((user) => (
                  <Card
                    sx={{
                      m: 2,
                      height: "80px",
                      transition: "transform 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                      borderRadius: "8px",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    key={user.id}
                    variant="outlined"
                  >
                    <CardContent>
                      <ListItem>
                        <Link
                          to={`/others/${user.userid}`}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItemAvatar>
                            <Avatar alt={user.name} src={user.avatarUrl} />
                          </ListItemAvatar>
                        </Link>
                        <ListItemText primary={user.name} />
                      </ListItem>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Box>
            {/* LOWER RIGHT BOX END*/}
          </Box>
          {/* RIGHT BOX MAIN END */}
        </Box>
      )}
      {/* MAIN BOX END */}
      {/*collaboration dialoge */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Send a note to ${clickedUser?.name}`}</DialogTitle>
        <DialogContent>
          <Stack direction={"row"} spacing={2}>
            <TextField
              sx={{ width: 500 }}
              multiline
              value={collabtext}
              size="small"
              onChange={(e) => setCollabtext(e.target.value)}
            />
            <IconButton
              disabled={discollabreqbtn}
              id={clickedUser.id}
              onClick={(e) => handleReqSent(e, clickedUser)}
              size="small"
              color="warning"
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </DialogContent>
      </Dialog>
      {/*explaination dialoge */}
      <Dialog
        open={eopen}
        onClose={handleeClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"This is the explanation you are looking for"}
        </DialogTitle>
        <DialogContent>
          <Typography>{explaination}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleeClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserInterface;
