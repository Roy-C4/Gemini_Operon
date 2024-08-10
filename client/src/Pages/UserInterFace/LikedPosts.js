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
  Paper,
  TextField,
  ListItemButton,
  Stack,
} from "@mui/material";
import { MdFileDownload } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Recommendation from "../../Components/SkeletonComponents/Recommendation";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { FaHandsClapping } from "react-icons/fa6";
import gemini from "../../Assets/Google_Gemini_logo.png";
const LikedPosts = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [recentidea, setrecentidea] = useState([
    {
      title: "E-commerce Store",
      description:
        "Start an e-commerce store selling products in a niche market that you are passionate about.",
      rating: 4,
      tags: ["E-commerce", "Online Business"],
    },
    {
      title: "Social Media Consulting",
      description:
        "Offer consulting services to businesses on how to effectively utilize social media for marketing.",
      rating: 3.5,
      tags: ["Consulting", "Social Media"],
    },
    {
      title: "Online Tutoring",
      description:
        "Provide online tutoring services in subjects you are knowledgeable and passionate about.",
      rating: 4.5,
      tags: ["Education", "Tutoring"],
    },
    {
      title: "Food Truck Business",
      description:
        "Start a food truck business offering unique and delicious cuisine in your area.",
      rating: 4,
      tags: ["Food", "Entrepreneurship"],
    },
  ]);
  const [matchedusers, setmatchedusers] = useState([]);
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg", // Sample avatar URL
    // Add more user data as needed
  };
  const [ideas, setideas] = useState([]);
  const [collaborators, setcollaborators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setloading] = useState(true);
  const [explaination, setexplaination] = useState("");
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = collaborators.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [showMore, setShowMore] = useState(false);

  const hashtags = [
    { id: "1", tag: "#Technology", posts: 1500 },
    { id: "2", tag: "#Healthcare", posts: 2500 },
    { id: "3", tag: "#Finance", posts: 1200 },
    { id: "4", tag: "#Retail", posts: 800 },
    { id: "5", tag: "#Hospitality", posts: 2000 },
    { id: "6", tag: "#Education", posts: 1100 },
    { id: "7", tag: "#Manufacturing", posts: 900 },
    { id: "8", tag: "#Transportation", posts: 700 },
    { id: "9", tag: "#Entertainment", posts: 600 },
    { id: "10", tag: "#RealEstate", posts: 1000 },
  ];

  const visibleHashtags = showMore ? hashtags : hashtags.slice(0, 7);

  // GET LIKED POSTS\\
  async function getLikedPosts() {
    try {
      const data = await fetch("/operon/api/v1/user/likedposts", {
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
      const processedIdeas = response.map((idea) => {
        const base64Image = `data:image/jpeg;base64,${byteArrayToBase64(
          new Uint8Array(idea.userimage.data)
        )}`;
        return {
          id: idea.ideaid,
          name: idea.postedby,
          avatarUrl: base64Image,
          title: idea.title,
          gist: idea.gist,
          description: idea.description,
          score: idea.score,
          category: idea.category,
          time: idea.time,
          rating_out_of_5: idea.rating_out_of_5,
          file1: idea.file1,
          file1name: idea.file1name,
          file1mimetype: idea.file1mimetype,
          file2: idea.file2,
          file2name: idea.file2name,
          file2mimetype: idea.file2mimetype,
          userid: idea.userid,
        };
      });

      setideas(processedIdeas);
      console.log(response);
      setloading(false);
      //   console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getLikedPosts();
  }, []);
  const handleReject = async (e, idea) => {
    e.preventDefault();
    try {
      const ideaid = idea.id;
      const body = { ideaid };
      const data = await fetch("/operon/api/v1/user/idea/dislike", {
        method: "POST",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.type === "success") {
        setideas(ideas.filter((opt) => opt.id !== ideaid));
      }
    } catch (error) {
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
      setOpen(true);
      setexplLoading(false);
      setexplLoading2(false);
    } catch (error) {
      setexplLoading(false);
      setexplLoading2(false);
      console.log(error.message);
    }
  };
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
  return (
    <>
      {/* <Navbar /> */}
      {/* MAIN BOX START */}
      {loading && <Recommendation />}
      {!loading && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", height: "93vh" }}
        >
          {/* LEFT BOX MAIN */}
          <Box sx={{ backgroundColor: "white", height: "100%", width: "30%" }}>
            <Card
              sx={{
                width: "90%",
                backgroundColor: "white",
                boxShadow: 3,
                borderRadius: 2,
                margin: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flex: "1 1 auto", overflowY: "auto" }}>
                <Typography
                  variant="h6"
                  color={"gray"}
                  gutterBottom
                  textAlign={"center"}
                >
                  TOP IDEAS
                </Typography>
                <List>
                  {visibleHashtags.map((hashtag) => (
                    <ListItemButton key={hashtag.id}>
                      <ListItemText
                        id={hashtag.id}
                        primary={hashtag.tag}
                        secondary={`${hashtag.posts} posts`}
                      />
                      <Divider />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ textAlign: "right", m: 1 }}>
                <Button
                  variant="text"
                  sx={{ color: "#ff9900" }}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less" : "See more"}
                </Button>
              </Box>
            </Card>
            <Stack
              justifyContent={"center"}
              mt={4}
              direction={"row"}
              spacing={2}
            >
              <Typography
                pt={1.6}
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
          </Box>
          {/* LEFT BOX MAIN END */}

          {/* MIDDLE BOX  */}
          <Box sx={{ backgroundColor: "white", height: "100%", width: "50%" }}>
            <div style={{ height: "4%" }}>
              <Typography
                variant="h5"
                mt={1}
                textAlign={"center"}
                color={"gray"}
              >
                Praised Ideas
              </Typography>
            </div>
            <div style={{ height: "95%", overflowY: "auto" }}>
              <Box sx={{ m: 1 }}>
                {ideas.map((idea) => (
                  <Card key={idea.id} sx={{ mb: 1 }}>
                    <CardContent>
                      <ListItem>
                        <Link
                          to={`/others/${idea.userid}`}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItemAvatar>
                            <Avatar alt={idea.name} src={idea.avatarUrl} />
                          </ListItemAvatar>
                        </Link>
                        <ListItemText>
                          <Typography variant="subtitle1" color="textSecondary">
                            {idea.name}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <Typography variant="h5" component="h2">
                        {idea.title}
                      </Typography>
                      <Typography variant="body1" color="textPrimary">
                        <b>Gist:</b> {idea.gist}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        <b>Description: </b>
                        {idea.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign={"end"}
                        color="text.secondary"
                      >
                        {idea.time}
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
                            icon={<MdFileDownload style={{ fontSize: 24 }} />}
                            sx={{
                              ml: 1,
                              "&:hover": {
                                backgroundColor: "#e0e0e0",
                                transition: "background-color 0.3s ease", // Add transition for hover effect
                                boxShadow: "0px 3px 10px rgba(0,0,0,0.2)", // Example boxShadow change on hover
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
                            icon={<MdFileDownload style={{ fontSize: 24 }} />} // Adjust the icon size here
                            sx={{
                              ml: 2,
                              "&:hover": {
                                backgroundColor: "#e0e0e0",
                                transition: "background-color 0.3s ease", // Add transition for hover effect
                                boxShadow: "0px 3px 10px rgba(0,0,0,0.2)", // Example boxShadow change on hover
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
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                      }}
                    >
                      <Box sx={{ width: "30%" }}>
                        <Typography
                          color="textSecondary"
                          component="p"
                          variant="subtitle2"
                          // sx={{
                          //   position: "absolute",
                          //   top: 0,
                          //   right: 0,
                          //   marginTop: 2,
                          //   marginRight: 2,
                          // }}
                        >
                          {parseInt(idea.rating_out_of_5)} Praise Rating Of 5
                        </Typography>
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
                        <Tooltip title="Reject Idea">
                          <IconButton
                            onClick={(e) => handleReject(e, idea)}
                            sx={{ ml: 2 }}
                            size="medium"
                            color="error"
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
                            borderRadius: 30,
                            backgroundColor: "white",
                            color: "#ff9900",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            borderColor: "#ff9900",
                            "&:hover": {
                              backgroundColor: "#ff9900",
                              color: "white",
                              borderColor: "white",
                            },
                          }}
                          variant="outlined"
                          color="warning"
                          size="large"
                          startIcon={<PersonAddAlt1Icon />}
                        >
                          Connect
                        </Button> */}
                      </Box>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </div>
          </Box>
          {/* MIDDLE BOX END*/}
          {/* RIGHT BOX MAIN */}
          <Box sx={{ backgroundColor: "white", height: "100%", width: "20%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="h5"
                mt={2}
                textAlign={"center"}
                color={"gray"}
              >
                COLLABORATORS
              </Typography>
              <input
                type="text"
                style={{
                  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                }}
                placeholder="Search collaborators..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <div style={{ height: "100%", overflowY: "auto" }}>
                {filteredUsers.map((user) => (
                  <Card
                    sx={{
                      m: 2,
                      height: "80px",
                      transition: "transform 0.3s ease",
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
          </Box>
          {/* RIGHT BOX MAIN END */}
        </Box>
      )}
      {/* MAIN BOX END */}
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LikedPosts;
