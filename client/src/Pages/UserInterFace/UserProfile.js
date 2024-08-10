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
  Tab,
  Tabs,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { toast, ToastContainer } from "react-toastify";
import {
  cheerfulFiestaPalette,
  cheerfulFiestaPaletteDark,
  cheerfulFiestaPaletteLight,
  mangoFusionPalette,
  mangoFusionPaletteDark,
  mangoFusionPaletteLight,
} from "@mui/x-charts";
import gemini from "../../Assets/Google_Gemini_logo.png";
const UserProfile = () => {
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
  const [expandedId, setExpandedId] = useState(null);
  const expandedRef = useRef(null);

  const handleExpandClick = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [age, setage] = useState("");
  const [about, setabout] = useState("");
  const [avatar, setavatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState();
  // for editmode
  const [eusername, seteusername] = useState("");
  const [eemail, seteemail] = useState("");
  const [epassword, setepassword] = useState("");
  const [eavatar, seteavatar] = useState(null);
  const [eabout, seteabout] = useState("");
  //
  //tabs
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const [date, setdate] = useState("");
  const [loading, setloading] = useState(true);
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
      seteavatar("data:image/jpeg;base64," + base64String);
      seteusername(res.username);
      seteemail(res.emailid);
      seteabout(res.about);
      setdate(res.date);
      //   setloading(false);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getuser();
  }, []);

  //my ideas
  const [recentidea, setrecentidea] = useState([]);
  async function getrecentideas() {
    try {
      const data = await fetch("/operon/api/v1/user/recentideas", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const res = await data.json();
      console.log(res);
      setrecentidea(res);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getrecentideas();
  }, []);

  const data = [
    { id: 0, value: 10, label: "series A" },
    { id: 1, value: 15, label: "series B" },
    { id: 2, value: 20, label: "series C" },
  ];
  //edit profile dialoge
  const [editpfopen, seteditpfopen] = useState(false);

  const handleClickepOpen = () => {
    seteditpfopen(true);
  };

  const handleepClose = () => {
    seteditpfopen(false);
  };
  //avtar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        seteavatar(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };
  //update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("about", eabout);
      formData.append("username", eusername);
      // First API call to update profile details
      const resDetails = await fetch(
        "/operon/api/v1/user/edit/profile/details",
        {
          method: "POST",
          headers: {
            token: token,
          },
          body: formData,
        }
      );

      const dataDetails = await resDetails.json();

      if (dataDetails.status === "success") {
        // Second API call to update profile avatar if avatar file exists
        if (avatarFile) {
          const formDataAvatar = new FormData();
          formDataAvatar.append("imageFile", avatarFile);

          const resAvatar = await fetch(
            "/operon/api/v1/user/edit/profile/avatar",
            {
              method: "POST",
              headers: {
                token: token,
              },
              body: formDataAvatar,
            }
          );

          const dataAvatar = await resAvatar.json();

          if (dataAvatar.status === "success") {
            toast.success(dataAvatar.message);
          } else {
            toast.error(dataAvatar.message);
          }
        } else {
          toast.success(dataDetails.message);
        }

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(dataDetails.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "93vh",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            width: "30%",
          }}
        >
          <Card
            sx={{
              m: 2,
              width: "auto",
              height: 500,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
              borderRadius: "8px", // Rounded corners
            }}
            variant="outlined"
          >
            <Box sx={{ m: 1, display: "flex", justifyContent: "flex-end" }}>
              <Tooltip placement="top" title="Edit Profile">
                <IconButton
                  sx={{ alignSelf: "end", marginLeft: 1 }}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleClickepOpen}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={username}
                src={avatar}
                sx={{ width: 100, height: 100, marginRight: 2 }}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  {username}
                </Typography>

                <Typography variant="body1" gutterBottom>
                  Age: {age}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  About: {about}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Joined: {date}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Stack justifyContent={"center"} mt={1} direction={"row"} spacing={2}>
            <Typography
            pt={1.9}
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
                //height: "45%", // Adjust the height as needed
              }}
            />
          </Stack>
          {/* <Card
            sx={{
              m: 2,
              width: "100%",
              height: 500,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
              borderRadius: "8px", // Rounded corners
            }}
            variant="outlined"
          >
            <Typography
              variant="body1"
              mt={1}
              textAlign={"center"}
              color={"gray"}
            >
              Total Engage
            </Typography>
            <BarChart
              colors={cheerfulFiestaPaletteLight}
              skipAnimation={false}
              xAxis={[
                {
                  scaleType: "band",
                  data: ["group A", "group B", "group C"],
                },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              width={250}
              height={200}
            />
            <Typography
              variant="body1"
              mt={1}
              textAlign={"center"}
              color={"gray"}
            >
              Total Engage
            </Typography>
            <PieChart
              colors={cheerfulFiestaPaletteLight}
              series={[
                {
                  data,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={150}
            />
          </Card> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            backgroundColor: "white",
            width: "70%",
          }}
        >
          <Typography variant="h5" mt={2} textAlign={"center"} color={"gray"}>
            My Posts
          </Typography>
          <div style={{ height: "100%", overflowY: "auto" }}>
            {recentidea.length > 0 &&
              recentidea.map((idea, index) => (
                <Card
                  sx={{
                    p: 1,
                    m: 2,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                    borderRadius: "8px", // Rounded corners
                  }}
                  key={index}
                >
                  <CardContent>
                    <Typography
                      textAlign={"center"}
                      fontWeight={"bold"}
                      gutterBottom
                      variant="body1"
                      component="div"
                    >
                      {idea.title}
                    </Typography>
                    <Typography
                      textAlign={"justify"}
                      variant="body2"
                      color="text.secondary"
                    >
                      <b>• Gist:</b> {idea.gist}
                    </Typography>
                    <Typography
                      mt={1}
                      textAlign={"justify"}
                      variant="body2"
                      color="text.secondary"
                    >
                      <b>• Description:</b>
                    </Typography>
                    <Typography
                      textAlign={"justify"}
                      variant="body2"
                      color="text.secondary"
                    >
                      {idea.description}
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
                          style={{ marginRight: "5px", marginBottom: "5px" }}
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
      </Box>
      <Dialog open={editpfopen} onClose={handleepClose}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: 500,
              height: 400,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              rowGap: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              style={{ width: 90, height: 90 }}
              alt="Avatar"
              src={eavatar || "/default-avatar.png"}
              onClick={handleAvatarClick}
            />
            <input
              type="file"
              accept="image/*"
              id="avatarInput"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            <TextField
              fullWidth
              value={eusername}
              size="small"
              label="Name"
              onChange={(e) => seteusername(e.target.value)}
            />
            {/* <TextField
              value={eemail}
              size="small"
              label="Email Id"
              onChange={(e) => seteemail(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              defaultValue={epassword}
              size="small"
              label="Password"
              onChange={(e) => setepassword(e.target.value)}
            /> */}
            <TextField
              multiline
              fullWidth
              value={eabout}
              size="small"
              label="About"
              onChange={(e) => seteabout(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleepClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="small"
            color="success"
          >
            Save{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
