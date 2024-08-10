import { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import {
  Switch,
  Route,
  useHistory,
  Redirect,
} from "react-router-dom/cjs/react-router-dom.min";
import PostIdea from "./Pages/PostIdeas/PostIdea";
import Feed from "./Pages/UserInterFace/Feed";
import Chat from "./Pages/ChatInterface/Chat";
import Loading from "./Components/Loading";
import Navbar from "./Components/Navbar";
import NotFoundPage from "./Components/NotFoundPage";
import Recommendation from "./Components/SkeletonComponents/Recommendation";
import UserProfile from "./Pages/UserInterFace/UserProfile";
import OthersProfile from "./Pages/UserInterFace/OthersProfile";
import { io } from "socket.io-client";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./Css/DriverJs.css";
//import Connections from "./Pages/UserInterFace/Connections";
// import LikedPosts from "./Pages/UserInterFace/LikedPosts";
const UserInterface = lazy(() => import("./Pages/UserInterFace/UserInterface"));
const LikedPosts = lazy(() => import("./Pages/UserInterFace/LikedPosts"));
const Connections = lazy(() => import("./Pages/UserInterFace/Connections"));
const App = () => {
  const [userType, setUserType] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userid, setUserId] = useState("");
  const [socket, setSocket] = useState(null);
  const [username, setusername] = useState("");
  const token = localStorage.getItem("token");
  const history = useHistory();
  //verify user
  async function getAuthStatus() {
    try {
      const response = await fetch("/operon/api/v1/user/login/verify", {
        method: "GET",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.authstatus === true) {
        setIsAuth(true);
        setUserType(data.utype);
        setUserId(data.uid);
      } else {
        setIsAuth(false);
        history.push("/"); // Redirect to the homepage
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getAuthStatus();
  }, [history]);
  useEffect(() => {
    if (!isAuth) return;
    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [isAuth, userid]);
  // add online users
  useEffect(() => {
    if (socket === null) return;
    if (!isAuth) return;
    socket.emit("addNewUser", userid);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [isAuth, socket]);

  //driver js start
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      overlayColor: "#219ebc",
      popoverClass: "driverjs-theme",
      allowClose: true,
      showButtons: ["next", "previous"],
      steps: [
        {
          element: "#profile",
          popover: {
            title: "Your Profile",
            description: "This is Your Profile",
            position: "right",
          },
        },
        {
          element: "#recent",
          popover: {
            title: "Recent Ideas",
            description:
              "In this part your posted recent Ideas will be showed.",
            position: "bottom",
          },
        },
        {
          element: "#recommendation",
          popover: {
            title: "Recommendation",
            description: "This is your recommendation.",
            position: "top",
          },
        },
        {
          element: "#matcheduser",
          popover: {
            title: "Recommended Users",
            description:
              "Greatest minds always think the same! Here you can see a list of users who thinks like you. Make connections and innovate something.",
            position: "top",
          },
        },
        {
          element: "#collaborators",
          popover: {
            title: "Collaborators",
            description: "Collaborators",
            position: "top",
          },
        },
        {
          element: "#myfeed",
          popover: {
            title: "Feed",
            description:
              "Here you can see what people are thinking and their ideas. Praise the idea if you like it!",
            position: "top",
          },
        },
        {
          element: "#praisedideas",
          popover: {
            title: "Praised Ideas",
            description:
              "Here you will see all the ideas that you have praised.",
            position: "top",
          },
        },
        {
          element: "#chats",
          popover: {
            title: "Chats",
            description:
              "Here you can chat with the people that you have made connections with.",
            position: "top",
          },
        },
        {
          element: "#postbtn",
          popover: {
            title: "Post",
            description:
              "This is where the magic happens. You post your idea and begin.",
            position: "top",
          },
        },
        {
          element: "#myavatar",
          popover: {
            title: "Settings",
            description:
              "This is where you can customize your profile, view your connection status and more!",
            position: "top",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && !isAuth && (
        <Switch>
          <Route exact path="/" render={(props) => <HomePage {...props} />} />
          <Route
            exact
            path="/login"
            render={(props) => (
              <LoginPage
                setIsAuth={setIsAuth}
                setUserType={setUserType}
                setUserId={setUserId}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={(props) => <SignUpPage {...props} />}
          />
          <Redirect to="/" />
        </Switch>
      )}
      {!isLoading && isAuth && userType === "U" && (
        <>
          <Navbar
            setIsAuth={setIsAuth}
            setUserType={setUserType}
            startTour={startTour}
            socket={socket}
            username={username}
            setusername={setusername}
          />
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route
                exact
                path="/ui"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <UserInterface
                      socket={socket}
                      startTour={startTour}
                      {...props}
                    />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/post"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <PostIdea {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/feed"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <Feed {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/chat"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <Chat {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/uprofile"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <UserProfile {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/liked"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <LikedPosts {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/others/:userId"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <OthersProfile
                      socket={socket}
                      ownUsername={username}
                      {...props}
                    />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/connections"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <Connections {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/chats"
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <Chat
                      {...props}
                      socket={socket}
                      onlineUsers={onlineUsers}
                    />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                render={(props) =>
                  isAuth && userType === "U" ? (
                    <NotFoundPage {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
            </Switch>
          </Suspense>
          {/* <Footer /> */}
        </>
      )}
      {/* <Switch>
        <Route exact path="/" render={(props) => <HomePage {...props} />} />
        <Route
          exact
          path="/login"
          render={(props) => <LoginPage {...props} />}
        />
        <Route
          exact
          path="/signup"
          render={(props) => <SignUpPage {...props} />}
        />
        <Route
          exact
          path="/ui"
          render={(props) => <UserInterface {...props} />}
        />
        <Route exact path="/post" render={(props) => <PostIdea {...props} />} />
        <Route exact path="/feed" render={(props) => <Feed {...props} />} />
        <Route exact path="/chat" render={(props) => <Chat {...props} />} />
      </Switch> */}
    </>
  );
};

export default App;
