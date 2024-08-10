import React, { useState } from "react";
import "../Css/SignUpPage.css";
import reg from "../Assets/reg.avif";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Button, Avatar } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SignUpPage = () => {
  const history = useHistory();
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [dob, setdob] = useState("");
  // const [about, setabout] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (avatarFile === null) {
      toast.error("Image is needed!!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("dob", dob);
      formData.append("email", email);
      formData.append("imageFile", avatarFile);
      const res = await fetch("/operon/api/v1/user/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        toast.success(data.message);
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "10%",
          }}
        >
          <a href="/" className="signup-image-link">
            <h4 style={{ color: "#ed6c02" }}>🠔Back to the home</h4>
          </a>
        </div>
        <div className="signupcontainer">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="zmdi zmdi-account material-icons-name"></i>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 5,
                    }}
                  >
                    <Avatar
                      style={{ width: 90, height: 90 }}
                      alt="Avatar"
                      src={avatar || "/default-avatar.png"}
                      onClick={handleAvatarClick}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="avatarInput"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    value={username}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    onChange={(e) => setusername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email"></i>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={email}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
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
                <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline"></i>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    placeholder="Date Of Birth"
                    value={dob}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    onChange={(e) => setdob(e.target.value)}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline"></i>
                  </label>
                  <input
                    type="text"
                    name="about"
                    id="about"
                    placeholder="About"
                    value={about}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    onChange={(e) => setabout(e.target.value)}
                  />
                </div> */}
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
                    fullWidth
                    color="warning"
                    size="medium"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Register
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
                    Sign Up With
                  </Button>
                  <Button
                    color="warning"
                    size="small"
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
                    variant="contained"
                    endIcon={<FacebookIcon />}
                  >
                    Sign Up With
                  </Button>
                </div> */}
              </form>
            </div>
            <div className="signup-image">
              <figure>
                <img src={reg} alt="sign up" />
              </figure>
              <Link to="/login" className="signup-image-link">
                Already a member? Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
