import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
// Replace AdbIcon import with an image import
import logoImage from "../Assets/oplogo.png";
import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer, toast } from "react-toastify";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { styled, keyframes } from "@mui/system";
import CreateIcon from "@mui/icons-material/Create";
import { Badge, Divider } from "@mui/material";

const glowing = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
`;
const GlowButton = styled(Button)(({ theme }) => ({
  width: "110px",
  height: "40px",
  border: "none",
  outline: "none",
  marginTop: 5,
  color: "#fff",
  background: "#111",
  cursor: "pointer",
  position: "relative",
  zIndex: 0,
  borderRadius: "10px",
  color: "white",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#ff9900",
    color: "white",
    borderColor: "white",
  },
  "&:before": {
    content: '""',
    background:
      "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
    position: "absolute",
    top: "-2px",
    left: "-2px",
    backgroundSize: "400%",
    zIndex: -1,
    filter: "blur(5px)",
    width: "calc(100% + 4px)",
    height: "calc(100% + 4px)",
    animation: `${glowing} 20s linear infinite`,
    opacity: 1, // Set opacity to 1 by default
    borderRadius: "10px",
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "#111",
    left: 0,
    top: 0,
    borderRadius: "10px",
    zIndex: -1,
  },
  "&:active": {
    color: "white",
  },
  "&:active:after": {
    background: "transparent",
  },
}));
const Navbar = ({
  setIsAuth,
  setUserType,
  socket,
  startTour,
  username,
  setusername,
}) => {
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
  const history = useHistory();
  const [avatar, setavatar] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [email, setemail] = useState("");
  const [age, setage] = useState("");
  const userid = localStorage.getItem("uid");
  const pages = [
    {
      id: "recommendations",
      pageName: "Recommendations",
      path: "/ui",
    },
    {
      id: "myfeed",
      pageName: "My Feed",
      path: "/feed",
    },
    {
      id: "praisedideas",
      pageName: "Praised Ideas",
      path: "/liked",
    },
    {
      id: "chats",
      pageName: "Chats",
      path: "/chats",
    },
  ];
  const settings = ["Profile", "Connections", "Logout"];
  const [notifications, setNotifications] = useState([
    //{ title: "Alert", detail: "Suspicious login attempt detected." },
  ]);
  //all notifications
  async function getAllNotifications() {
    try {
      const res = await fetch(
        "/operon/api/v1/user/notification/allnotifications",
        {
          method: "GET",
          headers: {
            token: token,
          },
        }
      );
      const data = await res.json();
      setNotifications(data.allnotifications);
      setUnreadCount(parseInt(data.unreadcount));
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getAllNotifications();
  }, []);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  //--- EASY WAY OUT --\\
  const handleNotifyClick = (event) => {
    if (notifications.length > 0) {
      setAnchorEl(event.currentTarget);
      setUnreadCount(0);
    } else {
      return;
    }
  };
  // useEffect(() => {
  //   setUnreadCount(parseInt(unreadCount)+1);
  // }, [notifications]);

  const handleNotifyClose = () => {
    setAnchorEl(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  console.log(notifications);
  //Recieve notif using socket
  useEffect(() => {
    if (socket === null) return;
    socket.on("getNotes", (res) => {
      if (userid !== res.recipientid) return;
      setNotifications((prev) => [
        ...prev,
        {
          notifyid: res.notifyid,
          title: "Connection Request",
          detail: res.collabtext,
          receievedfromname: res.receievedfromname,
        },
      ]);
      setUnreadCount((prev) => parseInt(prev) + 1);
    });
    return () => {
      socket.off("getNotes");
    };
  }, [socket, notifications]);
  const handleClick = (action) => {
    handleCloseUserMenu();
    if (action === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("utype");
      setIsAuth(false);
      setUserType("");
      toast.error("Loging Out");
      setTimeout(() => {
        history.push("/");
      }, 1500);
    } else if (action === "Profile") {
      history.push("/uprofile");
    } else {
      history.push("/connections");
    }
  };
  //users
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
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getuser();
  }, []);

  //read notification
  const handleRead = async (e, notification) => {
    e.preventDefault();
    console.log(notification);
    try {
      const res = await fetch(
        `/operon/api/v1/user/notification/read/${notification.notifyid}`,
        {
          method: "PUT",
          headers: { token: token, "Content-type": "application/json" },
        }
      );
      const data = await res.json();
      setAnchorEl(null);
      if (data.type === "success") {
        if (notification.title === "Connection Request") {
          history.push("/connections");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <AppBar
        position="sticky"
        sx={{
          height: "7vh",
          boxShadow: "none",
          backgroundColor: "#ffdb4d",
          paddingBottom: 8,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/ui">
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  display: { xs: "none", md: "flex" },
                  marginRight: 1,
                  width: 70,
                  height: 70,
                }}
              />
            </Link>
            <Typography
              variant="h6"
              sx={{
                marginRight: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
                color: "black",
              }}
            >
              OPERON
            </Typography>

            {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      variant="body1"
                      color={"black"}
                    >
                      {page.pageName}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
            {/* <img src={logoImage} alt="Logo" style={{ display: { xs: "none", md: "flex" }, marginRight: 1,width: 40,height: 40 }}/> */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                marginRight: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              OPERON
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                ml: "10%",
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <NavLink
                  id={page.id}
                  activeStyle={{
                    backgroundColor: "black",
                    color: "#ffdb4d",
                    borderRadius: "80px", // Border radius when active
                  }}
                  to={page.path}
                  style={{ textDecoration: "none" }}
                >
                  <Typography fontWeight={"bold"} sx={{ p: 1 }}>
                    {page.pageName}
                  </Typography>
                </NavLink>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                flexDirection: "row",
                flexGrow: 0,
              }}
            >
              <Link to="/post">
                <GlowButton
                  id={"postbtn"}
                  sx={{
                    mr: 2,
                    ml: 2,
                    borderRadius: 30,
                    cursor: "pointer",
                  }}
                  variant="outlined"
                  color="warning"
                  size="small"
                  startIcon={<CreateIcon />}
                >
                  POST
                </GlowButton>
              </Link>
              <Tooltip title="Notification">
                <IconButton
                  id="notifbtn"
                  sx={{ ml: 5, color: "black" }}
                  size="small"
                  onClick={handleNotifyClick}
                >
                  <Badge badgeContent={unreadCount} color="primary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton sx={{ ml: 5 }} onClick={handleOpenUserMenu}>
                  <Avatar id="myavatar" src={avatar} alt={username} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  style: {
                    backgroundColor: "#333", // Dark background color
                    color: "white", // White text color
                    maxHeight: "80vh", // Set max height to 80% of viewport height
                    overflowY: "auto", // Enable vertical scrolling
                  },
                }}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleNotifyClose}
                PaperProps={{
                  style: {
                    backgroundColor: "#333", // Dark background color
                    color: "white", // White text color
                    maxHeight: "80vh", // Set max height to 80% of viewport height
                    overflowY: "auto", // Enable vertical scrolling
                  },
                }}
              >
                {notifications?.map((notification) => (
                  <MenuItem
                    key={notification.notifyid}
                    onClick={(e) => handleRead(e, notification)}
                  >
                    <div>
                      <Typography variant="subtitle1">
                        {notification.detail}
                      </Typography>
                      <Typography variant="body2" color="#D3D3D3">
                        {notification.title} from{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {notification.receievedfromname}
                        </span>
                      </Typography>

                      {/* {notification.title === "Connection Request" && (
                        <Box display="flex" justifyContent="flex-start" mt={1}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            style={{ marginLeft: "8px" }}
                          >
                            Decline
                          </Button>
                        </Box>
                      )} */}
                      <Divider />
                    </div>
                    {/* <Divider /> */}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
