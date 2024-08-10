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
  Skeleton,
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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Feed = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", height: "93vh" }}>
      {/* LEFT BOX MAIN */}
      <Box sx={{ backgroundColor: "white", height: "100%", width: "30%" }}>
        {/* UPPER LEFT BOX */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            height: "70%",
            alignItems: "center",
          }}
        >
          {/* <Skeleton variant="text" sx={{ fontSize: "1rem" }} /> */}
          <Card sx={{ p: 1, m: 2, height: "100%", width: 450 }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem", mt: 2 }} />
            </CardContent>
            <CardActions>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton variant="rounded" width={80} height={30} />
              </Box>
            </CardActions>
          </Card>
        </Box>
        {/* UPPER LEFT BOX END*/}
        {/* LOWER LEFT BOX */}
        {/* LOWER LEFT BOX END*/}
      </Box>
      {/* LEFT BOX MAIN END */}

      {/* MIDDLE BOX  */}
      <Box sx={{ backgroundColor: "white", height: "100%", width: "50%" }}>
        <div style={{ height: "4%" }}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", mt: 1, height: 40 }}
          />
        </div>
        <div style={{ height: "95%", overflowY: "auto" }}>
          <Box sx={{ m: 1 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                {/* <Collapse
                      in={expandedId === idea.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Typography variant="body1" color="textPrimary">
                        Gist: {idea.gist}
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
                          Description: {idea.description}
                        </Typography>
                      </div>
                    </Collapse> */}
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                  <div style={{ marginTop: "10px" }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </div>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Skeleton variant="rounded" width={80} height={30} />
                  {/* <IconButton
                        onClick={() => handleExpandClick(idea.id)}
                        size="small"
                      >
                        {expandedId === idea.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton> */}
                </Box>
              </CardActions>
            </Card>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                {/* <Collapse
                      in={expandedId === idea.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Typography variant="body1" color="textPrimary">
                        Gist: {idea.gist}
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
                          Description: {idea.description}
                        </Typography>
                      </div>
                    </Collapse> */}
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                  <div style={{ marginTop: "10px" }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </div>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Skeleton variant="rounded" width={80} height={30} />
                  {/* <IconButton
                        onClick={() => handleExpandClick(idea.id)}
                        size="small"
                      >
                        {expandedId === idea.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton> */}
                </Box>
              </CardActions>
            </Card>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                {/* <Collapse
                      in={expandedId === idea.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Typography variant="body1" color="textPrimary">
                        Gist: {idea.gist}
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
                          Description: {idea.description}
                        </Typography>
                      </div>
                    </Collapse> */}
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                  <div style={{ marginTop: "10px" }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </div>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Skeleton variant="rounded" width={80} height={30} />
                  {/* <IconButton
                        onClick={() => handleExpandClick(idea.id)}
                        size="small"
                      >
                        {expandedId === idea.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton> */}
                </Box>
              </CardActions>
            </Card>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                {/* <Collapse
                      in={expandedId === idea.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Typography variant="body1" color="textPrimary">
                        Gist: {idea.gist}
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
                          Description: {idea.description}
                        </Typography>
                      </div>
                    </Collapse> */}
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                  <div style={{ marginTop: "10px" }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </div>
                </Box>
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Skeleton variant="rounded" width={80} height={30} />
                  {/* <IconButton
                        onClick={() => handleExpandClick(idea.id)}
                        size="small"
                      >
                        {expandedId === idea.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton> */}
                </Box>
              </CardActions>
            </Card>
          </Box>
        </div>
      </Box>
      {/* MIDDLE BOX END*/}
      {/* RIGHT BOX MAIN */}
      <Box sx={{ backgroundColor: "white", height: "100%", width: "20%" }}>
        {/* UPPER RIGHT BOX */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "white",
          }}
        >
          {/* <Typography variant="h5" mt={2} textAlign={"center"} color={"gray"}>
              Matched Users
            </Typography> */}
          <div style={{ height: "100%", overflowY: "auto" }}>
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
              variant="outlined"
            >
              <CardContent>
                <ListItem>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </ListItemText>
                  {/* <IconButton
                      size="small"
                      color="warning"
                      // onClick={() => handleConnect(idea.id)}
                    >
                      <PersonAddAlt1Icon />
                    </IconButton> */}
                </ListItem>
              </CardContent>
            </Card>
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
              variant="outlined"
            >
              <CardContent>
                <ListItem>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </ListItemText>
                  {/* <IconButton
                      size="small"
                      color="warning"
                      // onClick={() => handleConnect(idea.id)}
                    >
                      <PersonAddAlt1Icon />
                    </IconButton> */}
                </ListItem>
              </CardContent>
            </Card>
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
              variant="outlined"
            >
              <CardContent>
                <ListItem>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </ListItemText>
                  {/* <IconButton
                      size="small"
                      color="warning"
                      // onClick={() => handleConnect(idea.id)}
                    >
                      <PersonAddAlt1Icon />
                    </IconButton> */}
                </ListItem>
              </CardContent>
            </Card>
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
              variant="outlined"
            >
              <CardContent>
                <ListItem>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </ListItemText>
                  {/* <IconButton
                      size="small"
                      color="warning"
                      // onClick={() => handleConnect(idea.id)}
                    >
                      <PersonAddAlt1Icon />
                    </IconButton> */}
                </ListItem>
              </CardContent>
            </Card>
          </div>
        </Box>
        {/* UPPER RIGHT BOX END*/}
        {/* LOWER RIGHT BOX */}
        {/* LOWER RIGHT BOX END*/}
      </Box>

      {/* RIGHT BOX MAIN END */}
    </Box>
  );
};

export default Feed;
