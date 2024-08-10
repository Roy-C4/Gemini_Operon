import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
  Stack,
} from "@mui/material";
import ModeCommentIcon from "@mui/icons-material/Chat";
import { toast, ToastContainer } from "react-toastify";
import {
  Link,
  Redirect,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Connections = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  // const arrayBufferToBase64 = (buffer) => {
  //   let binary = "";
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // };
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [pendingreq, setpendingreq] = useState([]);
  const [receieverdreq, setreceievedreq] = useState([]);
  const [connections, setconnection] = useState([]);
  const [disableAccept, setdisableAccept] = useState(false);
  const [disableDecline, setdisableDecline] = useState(false);
  const [fetchConnections, setFetchConnections] = useState(false);
  //pending req
  async function getpendingreq() {
    try {
      const data = await fetch("/operon/api/v1/user/collab/pending", {
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
        };
      });

      setpendingreq(processedUsers);
      //console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getpendingreq();
  }, []);
  //receieved req
  async function getreceieved() {
    try {
      const data = await fetch("/operon/api/v1/user/collab/recv/pending", {
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
        };
      });

      setreceievedreq(processedUsers);
      //console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getreceieved();
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
        };
      });

      setconnection(processedUsers);
      setFetchConnections(false);
      //console.log(response);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  }
  useEffect(() => {
    getconnection();
  }, []);
  //accept req
  const handleAcceptReq = async (e, user) => {
    e.preventDefault();
    // console.log(user.id);
    //setdisableAccept(true);
    try {
      const userid = user.id;
      const body = {
        userid: userid,
      };
      const data = await fetch("/operon/api/v1/user/collab/accept", {
        method: "PUT",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.status === "success") {
        toast.success(res.message);
        setreceievedreq(receieverdreq.filter((opt) => opt.id !== userid));
        setFetchConnections(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //decline req
  const handleDeclineReq = async (e, user) => {
    e.preventDefault();
    //setdisableDecline(true)
    // console.log(user.id);
    try {
      const userid = user.id;
      const body = {
        userid: userid,
      };
      const data = await fetch("/operon/api/v1/user/collab/decline", {
        method: "PUT",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.status === "success") {
        toast.success(res.message);
        setreceievedreq(receieverdreq.filter((opt) => opt.id !== userid));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //fetch connections if user Accepts a req
  useEffect(() => {
    if (fetchConnections === true) {
      getconnection();
    } else {
      return;
    }
  }, [fetchConnections]);

  //chat
  const redirectToChat = () => {
    console.log("chat");
    history.push("/chats");
  };
  const handleChat = async (e, user) => {
    e.preventDefault();
    // console.log(user.id);
    try {
      const receiverid = user.usersrl;
      const body = {
        receiverid,
      };
      const data = await fetch("/operon/api/v1/user/chat/chatcreate", {
        method: "POST",
        headers: { token: token, "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res.length > 0) {
        redirectToChat();
      }
      // <Link to="/chats"/>
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          width: "100%",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Receieved Requests" {...a11yProps(0)} />
          <Tab label="Sent Requests" {...a11yProps(1)} />
          <Tab label="Connections" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {/* <Typography variant="h5" mt={2} textAlign={"center"} color={"gray"}>
          Receieved Requests
        </Typography> */}
          <div
            style={{
              height: "100%",
              justifyContent: "center",
              overflowY: "auto",
            }}
          >
            {receieverdreq.map((user) => (
              <Card
                sx={{
                  m: 2,
                  height: "80px",
                  transition: "transform 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                  borderRadius: "8px",
                  // "&:hover": {
                  //   transform: "scale(1.03)",
                  //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  // },
                }}
                key={user.id}
                variant="outlined"
              >
                <CardContent>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                    <Button
                      id={user.id}
                      disabled={disableAccept}
                      sx={{ ml: 2 }}
                      onClick={(e) => handleAcceptReq(e, user)}
                      size="small"
                      color="success"
                      variant="contained"
                    >
                      Accept
                    </Button>
                    <Button
                      disabled={disableDecline}
                      sx={{ ml: 2 }}
                      id={user.id}
                      onClick={(e) => handleDeclineReq(e, user)}
                      size="small"
                      color="error"
                      variant="contained"
                    >
                      Reject
                    </Button>
                  </ListItem>
                </CardContent>
              </Card>
            ))}
            {receieverdreq.length === 0 && (
              <Typography>No Receieved Requests Right Now!!</Typography>
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* <Typography variant="h5" mt={2} textAlign={"center"} color={"gray"}>
          Sent Requests
        </Typography> */}
          <div
            style={{
              height: "100%",
              justifyContent: "center",
              overflowY: "auto",
            }}
          >
            {pendingreq.map((user) => (
              <Card
                sx={{
                  m: 2,
                  height: "80px",
                  transition: "transform 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                  borderRadius: "8px",
                  // "&:hover": {
                  //   transform: "scale(1.03)",
                  //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  // },
                }}
                key={user.id}
                variant="outlined"
              >
                <CardContent>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                </CardContent>
              </Card>
            ))}
            {pendingreq.length === 0 && (
              <Typography>No Pending Requests Available Right Now</Typography>
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Typography variant="h5" mt={2} textAlign={"center"} color={"gray"}>
          Connections
        </Typography> */}
          <div
            style={{
              height: "100%",
              justifyContent: "center",
              overflowY: "auto",
            }}
          >
            {connections.map((user) => (
              <Card
                sx={{
                  m: 2,
                  height: "80px",
                  transition: "transform 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Added subtle shadow
                  borderRadius: "8px",
                  // "&:hover": {
                  //   transform: "scale(1.03)",
                  //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  // },
                }}
                key={user.id}
                variant="outlined"
              >
                <CardContent>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                    <IconButton onClick={(e) => handleChat(e, user)}>
                      <ModeCommentIcon />
                    </IconButton>
                  </ListItem>
                </CardContent>
              </Card>
            ))}
            {connections.length === 0 && (
              <Typography>
                You Have No Connections Dear,Try To Add more Connections!!
              </Typography>
            )}
          </div>
        </TabPanel>
      </Box>
    </>
  );
};

export default Connections;
