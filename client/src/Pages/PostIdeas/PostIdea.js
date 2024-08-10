import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Autocomplete,
  Toolbar,
  IconButton,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useDropzone } from "react-dropzone";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "../../Components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "react-lottie";
import generate from "../../Assets/generatingReccomandation.json";
import "../../Css/GeneratingRecom.css";

const PostIdea = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [gist, setgist] = useState("");
  const [description, setDescription] = useState("");
  const [tagsopts, setTagsopts] = useState([]);
  const [tagsinput, setTagsinput] = useState([]);
  const [disablesubmit, setdisablesubmit] = useState(false);
  console.log("tagsinput", tagsinput);
  const [files, setFiles] = useState([]);
  const baseStyle = {
    flex: 1,
    height: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: generate,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleFileDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: handleFileDrop,
  });
  //tags
  async function gettags() {
    try {
      const data = await fetch("/operon/api/v1/user/bizcatg", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const res = await data.json();
      setTagsopts(res);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    gettags();
  }, []);
  //post idea:
  const postidea = async (e) => {
    e.preventDefault();
    setdisablesubmit(true);

    if (
      description === "" &&
      gist === "" &&
      title === "" &&
      tagsinput.length === 0
    ) {
      setdisablesubmit(false);
      toast.error("Something went wrong!!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("gist", gist);
      formData.append("title", title);
      formData.append("categoryarray", JSON.stringify(tagsinput));

      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`file${index + 1}`, file);
        });
      }

      const response = await fetch("/operon/api/v1/user/postidea", {
        method: "POST",
        headers: {
          token: token,
        },
        body: formData,
      });

      const res = await response.json();
      if (res.type === "success") {
        setTimeout(() => {
          toast.info(res.message);
          history.push("/ui");
        }, 2000);
      } else {
        setdisablesubmit(false);
        toast.error(res.message);
      }
    } catch (error) {
      setdisablesubmit(false);
      console.log(error.message);
    }
  };
  return (
    <>
      {" "}
      <ToastContainer />
      {/* <Navbar /> */}
      {!disablesubmit && (
        <Container maxWidth="md">
          <Paper sx={{ padding: 5, marginTop: 4 }}>
            <Box mt={4}>
              <Typography variant="h4" align="center" gutterBottom>
                Post Your Ideas
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box mb={1}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    value={tagsinput}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      if (newValue.length > 2) {
                        toast.info(
                          "More than 2 categories are not available for testing!"
                        );
                        setTagsinput(newValue.slice(0, 2));
                      } else {
                        setTagsinput(newValue);
                      }
                    }}
                    options={tagsopts}
                    getOptionLabel={(option) => option.catgname}
                    // defaultValue={[tagsopts[0]]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Tags"
                        placeholder="Favorites"
                      />
                    )}
                  />
                </Box>
                <Box mb={1}>
                  <TextField
                    fullWidth
                    id="title"
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Box>
                <Box mb={1}>
                  <TextField
                    fullWidth
                    id="description"
                    label="Gist"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={gist}
                    onChange={(e) => setgist(e.target.value)}
                    required
                  />
                </Box>
                <Box mb={1}>
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Box>

                <div {...getRootProps({ style: baseStyle })}>
                  <input {...getInputProps()} />
                  <Typography variant="body1" textAlign={"center"} gutterBottom>
                    Drag 'n' drop some files here, or click to select files
                  </Typography>
                </div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    flexDirection: "column",
                    p: 1,
                    overflowY: "auto",
                    height: "100%",
                  }}
                >
                  {files.map((file, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                      ) : (
                        <CardContent>
                          <Typography variant="body2" gutterBottom>
                            {file.name} - {file.size} bytes
                          </Typography>
                        </CardContent>
                      )}
                      <CardContent>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRemoveFile(file)}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    disabled={disablesubmit}
                    sx={{ mb: 2 }}
                    onClick={postidea}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                  <Link to="/ui">
                    <Button
                      sx={{ mb: 2, ml: 2 }}
                      variant="contained"
                      color="error"
                    >
                      Close
                    </Button>
                  </Link>
                </Box>
              </form>
            </Box>
          </Paper>
        </Container>
      )}
      {disablesubmit && (
        <div className="generate-container">
          <div className="generate-content">
            <Lottie
              options={defaultOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}
            />
            <h1 className="generate-title">Please Wait!!</h1>
            <p className="generate-text">We are generating recommendations...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PostIdea;
