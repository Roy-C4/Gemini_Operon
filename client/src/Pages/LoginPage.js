import React, { useState } from "react";
import "../Css/LoginPage.css";
import log from "../Assets/login.avif";
import { Button, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const LoginPage = ({ setUserType, setIsAuth,setUserId }) => {
  const history = useHistory();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { username, password };
      const res = await fetch(
        "/operon/api/v1/user/login",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      //console.log("logindata",data);
      if (data.type === "success") {
        setUserType(data.usertype);
        setUserId(data.uid);
        setIsAuth(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("utype", data.usertype);
        localStorage.setItem("uid",data.uid);
        toast.success(data.message);
        if (data.usertype === "U") {
          history.push("/ui");
        } else {
          history.push("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "10%",
          }}
        >
          <a href="/" className="signup-link">
            <h4 style={{ color: "#ed6c02" }}>🠔Back to the home</h4>
          </a>
        </div>
        <div className="logincontainer">
          <div className="login-content">
            <div className="login-form">
              <h2 className="form-title">Log In</h2>
              <form className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                  />
                  {/* <TextField
                    fullWidth
                    id="name"
                    label="Your Name"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    required
                  /> */}
                </div>
                {/* <div className="form-group">
                <label htmlFor="email">
                  <i className="zmdi zmdi-email"></i>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div> */}
                <div className="form-group" style={{ position: "relative" }}>
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock"></i>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {/* <div className="form-group">
                <label htmlFor="re-pass">
                  <i className="zmdi zmdi-lock-outline"></i>
                </label>
                <input
                  type="password"
                  name="re_pass"
                  id="re_pass"
                  placeholder="Repeat your password"
                  value={formData.re_pass}
                  onChange={handleChange}
                />
              </div> */}
                <div className="form-group">
                  {/* <input
                  type="checkbox"
                  name="agreeTerm"
                  id="agree-term"
                  className="agree-term"
                  checked={formData.agreeTerm}
                  onChange={handleChange}
                /> */}
                  {/* <label htmlFor="agree-term" className="label-agree-term">
                  <span>
                    <span></span>
                  </span>
                  I agree all statements in{" "}
                  <a href="#" className="term-service">
                    Terms of service
                  </a>
                </label> */}
                </div>
                <div className="form-group form-button">
                  <Button
                    sx={{
                      borderRadius: 30,
                      backgroundColor: "#ff9900",
                      color: "white",

                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      borderColor: "#ff9900",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#ff9900",
                        borderColor: "white",
                      },
                    }}
                    onClick={handleSubmit}
                    fullWidth
                    color="warning"
                    size="medium"
                    variant="contained"
                  >
                    LogIn
                  </Button>
                </div>
                {/* <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    sx={{
                      borderRadius: 30,
                      backgroundColor: "#ff9900",
                      color: "white",

                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      borderColor: "#ff9900",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#ff9900",
                        borderColor: "white",
                      },
                    }}
                    size="small"
                    variant="contained"
                    endIcon={<GoogleIcon />}
                  >
                    Login With
                  </Button>
                  <Button
                    sx={{
                      ml: 2,
                      borderRadius: 30,
                      backgroundColor: "#ff9900",
                      color: "white",

                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      borderColor: "#ff9900",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#ff9900",
                        borderColor: "white",
                      },
                    }}
                    color="warning"
                    size="small"
                    variant="contained"
                    endIcon={<FacebookIcon />}
                  >
                    Login With
                  </Button>
                </div> */}
              </form>
            </div>
            <div className="login-image">
              <figure>
                <img src={log} alt="signup" />
              </figure>
              <Link to="/signup" className="signup-image-link">
                New Here? Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
