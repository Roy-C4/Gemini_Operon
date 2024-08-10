import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Paper,
  TextField,
} from "@mui/material";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
const Chat = ({ socket, onlineUsers }) => {
  // console.log(socket,onlineUsers);
  const token = localStorage.getItem("token");
  const [userAvatar, setuserAvatar] = useState(null);
  const [username, setusername] = useState("");
  const [useremail, setuseremail] = useState("");
  const [collaborators, setcollaborators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  //chat user
  const [chatuserAvatar, setchatuserAvatar] = useState(null);
  const [chatusername, setchatusername] = useState("");
  const [sendDisable, setSentDisable] = useState(false);
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = collaborators.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  async function getconnection() {
    try {
      const data = await fetch("/operon/api/v1/user/chat/allchat", {
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
          chatid: user.chatid,
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
  //user details
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
      setuserAvatar("data:image/jpeg;base64," + base64String);
      setusername(res.username);
      setuseremail(res.emailid);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getuser();
  }, []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedChat, setselectedChat] = useState("");
  console.log(selectedChat);
  const [newMessage, setNewMessage] = useState("");
  const [test, settest] = useState("");
  //SEND A MESSAGE
  const handleSend = async (e) => {
    e.preventDefault();
    setSentDisable(true);
    try {
      if (message === "") {
        return;
      }
      const body = { message, chatid: selectedChat.chatid };
      const res = await fetch("/operon/api/v1/user/chat/message", {
        method: "POST",
        headers: {
          token: token,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.chatid === null) {
        toast.error(data.message);
        setSentDisable(false);
      } else {
        setNewMessage(data);
        setMessages((prev) => [...prev, data]);
        setMessage("");
        setSentDisable(false);
      }
    } catch (error) {
      setSentDisable(false);
      console.log(error.message);
    }
  };
  //get a specific chat
  const handleChat = async (e, user) => {
    e.preventDefault();
    try {
      setselectedChat(user);
      const chatid = user.chatid;
      const data = await fetch(`/operon/api/v1/user/chat/specchat/${chatid}`, {
        method: "GET",
        headers: { token: token },
      });
      const res = await data.json();
      const userImageBuffer = res[0].userimage.data;
      const base64String = arrayBufferToBase64(userImageBuffer);
      setchatuserAvatar("data:image/jpeg;base64," + base64String);
      setchatusername(res[0].username);
    } catch (error) {
      console.log(error.message);
    }
  };
  async function getallmsgs() {
    try {
      const res = await fetch(
        `operon/api/v1/user/chat/allmessage/${selectedChat.chatid}`,
        {
          method: "GET",
          headers: {
            token: token,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    if (selectedChat.chatid) {
      getallmsgs();
    }
  }, [selectedChat.chatid]);

  //send message realtime
  useEffect(() => {
    if (socket === null) return;
    socket.emit("sendMessage", {
      ...newMessage,
      recipientid: selectedChat.usersrl,
    });
  }, [socket, newMessage]);

  //get message realtime
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (selectedChat.chatid !== res.chatid) return;
      setMessages((prev) => [...prev, res]);
      // audio.play();
    });
    return () => {
      socket.off("getMessage");
    };
  }, [socket, selectedChat]);
  //////// SCROLL TO RECENT MESSAGE VIEW \\\\\\\\\
  const scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {/* <Navbar /> */}
      {/* MAIN BOX START */}
      <Box
        sx={{ display: "flex", justifyContent: "flex-start", height: "93vh" }}
      >
        {/* LEFT BOX MAIN */}
        <Box
          sx={{ backgroundColor: "whitesmoke", height: "100%", width: "30%" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              height: "15%",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                width: "100%",
                height: "100px",
                transition: "transform 0.3s ease",
                justifyContent: "flex-start",
                // "&:hover": {
                //   transform: "scale(1.03)",
                //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                // },
              }}
              variant="outlined"
            >
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={username}
                      src={userAvatar}
                      sx={{ width: "60px", height: "60px" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={username}
                    secondary={useremail}
                    sx={{ ml: 5 }}
                  />
                </ListItem>
              </List>
            </Card>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              height: "85%",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" textAlign={"center"} color={"gray"}>
              COLLABORATORS
            </Typography>
            <input
              type="text"
              placeholder="Search collaborators..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
              }}
            />
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
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
                    <ListItem onClick={(e) => handleChat(e, user)}>
                      <ListItemAvatar>
                        <Avatar alt={user.name} src={user.avatarUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={user.name} />
                    </ListItem>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        </Box>
        {/* LEFT BOX MAIN END */}

        {/* RIGHT BOX  */}
        <Box
          component={Paper}
          elevation={3}
          sx={{ height: "93vh", width: "70%" }}
        >
          {selectedChat && (
            <>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "93vh",
                  borderRadius: "5px",
                  background: "#fff",
                  boxShadow: "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderBottom: "2px solid #ddd",
                    background: "#eee",
                    color: "#666",
                  }}
                >
                  {chatusername && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar alt={chatusername} src={chatuserAvatar} />
                      </ListItemAvatar>
                      <ListItemText primary={chatusername} />
                    </ListItem>
                  )}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px",
                    backgroundColor: "#fcfcfe",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#ddd",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#bdbdbd",
                    },
                  }}
                >
                  {messages.map((msg) => (
                    <Box
                      ref={scroll}
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        marginBottom: "10px",
                        flexDirection:
                          (parseInt(msg.senderid) !==
                            parseInt(selectedChat.usersrl)) ===
                          true
                            ? "row-reverse"
                            : "row",
                      }}
                      key={msg.messageid}
                      recipient={
                        parseInt(msg.senderid) !==
                        parseInt(selectedChat.usersrl)
                          ? true
                          : false
                      }
                    >
                      {/* <Avatar
                    src={
                      parseInt(msg.senderid) === parseInt(selectedChat.usersrl)
                        ? "https://image.flaticon.com/icons/svg/145/145867.svg"
                        : "https://image.flaticon.com/icons/svg/327/327779.svg"
                    }
                  /> */}
                      <Box
                        sx={{
                          maxWidth: "450px",
                          padding: "15px",
                          borderRadius: "15px",
                          background:
                            (parseInt(msg.senderid) !==
                              parseInt(selectedChat.usersrl)) ===
                            true
                              ? "#ffdb4d"
                              : "#E59400",
                          color:
                            (parseInt(msg.senderid) !==
                              parseInt(selectedChat.usersrl)) ===
                            true
                              ? "#000"
                              : "#000",
                          borderBottomRightRadius:
                            (parseInt(msg.senderid) !==
                              parseInt(selectedChat.usersrl)) ===
                            true
                              ? "0"
                              : "15px",
                          borderBottomLeftRadius:
                            (parseInt(msg.senderid) !==
                              parseInt(selectedChat.usersrl)) ===
                            true
                              ? "15px"
                              : "0",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                        }}
                        recipient={
                          parseInt(msg.senderid) !==
                          parseInt(selectedChat.usersrl)
                            ? true
                            : false
                        }
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          {/* <Typography variant="body2" fontWeight="bold">
                        {msg.sender}
                      </Typography> */}
                          <Typography
                            fontFamily={
                              "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
                            }
                            variant="body2"
                          >
                            {msg.message}
                          </Typography>
                        </Box>
                        <Typography
                          textAlign={"end"}
                          sx={{ fontSize: 10 }}
                          color={"GrayText"}
                          fontFamily={
                            "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
                          }
                          variant="subtitle2"
                        >
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    padding: "10px",
                    borderTop: "2px solid #ddd",
                    background: "#eee",
                  }}
                >
                  <TextField
                    id="message"
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    variant="outlined"
                    placeholder="Enter your message..."
                    size="small"
                    sx={{ width: "100%" }}
                  />
                  <Button
                    disabled={sendDisable}
                    sx={{ ml: 2 }}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          )}
          {!selectedChat && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "93vh",
                borderRadius: "5px",
                background: "#fff",
                boxShadow: "0 15px 15px -5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                textAlign={"center"}
                alignItems={"center"}
              >
                Please select a collaborator!!
              </Typography>
            </Box>
          )}
        </Box>
        {/* RIGHT BOX END*/}
      </Box>
      {/* MAIN BOX END */}
    </>
  );
};

export default Chat;
