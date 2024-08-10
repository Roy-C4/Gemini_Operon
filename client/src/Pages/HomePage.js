// HomePage.js
import React, { useState, useEffect } from "react";
import "../Css/HomePage.css";
import logo from "../Assets/oplogo.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import SubmitIdea from "../Assets/idea.png";
import BrowseIdeas from "../Assets/BrowseIdeas.png";
import Collaborate from "../Assets/Collaborate.png";
import Discover from "../Assets/Discover.png";
import Dipanjan from "../Assets/myImage.jpg";
import Soumya from "../Assets/soumya.jpg";
import Soumyajit from "../Assets/soumyajit.jpeg";
import { toast, ToastContainer } from "react-toastify";
const HomePage = () => {
  const teamData = [
    {
      id: 1,
      name: "Dipanjan Sengupta",
      // description: "Lead Developer",
      image: Dipanjan,
    },
    {
      id: 2,
      name: "Soumya Roy",
      // description: "Marketing Specialist",
      image: Soumya,
    },
    {
      id: 3,
      name: "Soumyajit Mitra",
      // description: "UI/UX Designer",
      image: Soumyajit,
    },
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [disableSubmit, setdisableSubmit] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || email === "" || message === "") {
      toast.error("Please Check Again!!");
      return;
    }
    setdisableSubmit(true);
    try {
      const body = { name, message, email };
      const res = await fetch("/operon/api/v1/user/contact", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.type === "success") {
        toast.info(data.message);
      }
      setName("");
      setEmail("");
      setMessage("");
      setdisableSubmit(false);
    } catch (error) {
      setdisableSubmit(false);
      console.log(error.message);
    }
  };
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth" });
  };
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };

    handleResize(); // Check the initial screen width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobileOrTablet) {
    return (
      <div className="coming-soon-container">
        <h1>Coming Soon On Mobile Devices</h1>
      </div>
    );
  }
  return (
    <>
      <ToastContainer />
      <div>
        <div className="homeheader">
          <div className="container">
            <div
              className="logo"
              style={{ display: "flex", alignItems: "center" }}
            >
              <>
                <Link></Link>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    display: { xs: "none", md: "flex" },
                    marginRight: 1,
                    width: 100,
                    height: 100,
                  }}
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "black",
                    fontWeight: "bolder",
                    fontSize: 25,
                  }}
                >
                  <text
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    OPERON
                  </text>
                </span>
              </>
            </div>

            <nav>
              <ul>
                <li>
                  <a onClick={() => scrollToSection("hero")} href="#hero">
                    Home
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("about")} href="#about">
                    About Us
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("team")} href="#team">
                    Our Team
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("contact")} href="#contact">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
            <div className="user-account">
              <Link to="/signup">
                <button>Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
        <div id="hero">
          <section className="hero">
            <div className="container">
              <h1>Share, Collaborate, Innovate!</h1>
              <p>Join our community to turn ideas into reality.</p>
              <Link to="/login">
                <button className="cta-button">Get Started</button>
              </Link>
            </div>
          </section>
          {/* Submit Idea Section */}
          <section className="feature">
            <div className="container">
              <div className="feature-details">
                <h2>Submit Idea</h2>
                <p>
                  Have a revolutionary idea but don't know where to share?
                  Submit your ideas here and get valuable feedback from our
                  community of innovators! Whether it's a groundbreaking
                  invention, a disruptive business concept, or a creative
                  solution to a pressing problem, our platform provides a
                  supportive environment for you to showcase your vision and
                  receive constructive insights.Embark on your journey of
                  innovation with us! Our platform isn't just a place to share
                  ideas; it's a dynamic hub where creativity flourishes,
                  connections are made, and dreams become reality. Whether
                  you're a seasoned entrepreneur, a budding inventor, or someone
                  with a passion for change, our diverse community is ready to
                  embrace your ideas and help you refine them into impactful
                  projects. Don't let your vision go unheard – share it with us
                  and let's create something extraordinary together!
                </p>
              </div>
              <div className="feature-image">
                <img src={SubmitIdea} alt="Submit Idea" />
              </div>
            </div>
          </section>

          {/* Browse Ideas Section */}
          <section className="feature alternate">
            <div className="container">
              <div className="feature-image">
                <img src={BrowseIdeas} alt="Browse Ideas" />
              </div>
              <div className="feature-details" style={{ textAlign: "right" }}>
                <h2>Browse Ideas</h2>
                <p>
                  Dive into a sea of creativity where each idea is a pearl
                  waiting to be discovered. Let's build bridges between
                  imagination and reality, transforming dreams into tangible
                  innovations. Explore the uncharted territories of innovation,
                  where boundaries are mere invitations to push further. Join
                  the chorus of innovators, where every voice adds a unique
                  melody to the symphony of progress. Unleash your imagination
                  and let it soar to new heights, for the sky is just the
                  beginning. Embrace the spirit of collaboration as we weave a
                  tapestry of ideas, each thread contributing to a brighter
                  future. Together, let's navigate the maze of possibilities,
                  unlocking doors to innovation at every turn. Cast away the
                  constraints of convention and embark on a journey of endless
                  discovery. In this playground of ideas, there are no limits,
                  only endless horizons waiting to be explored. Every idea is a
                  spark, igniting the flame of innovation that lights the path
                  towards tomorrow.
                </p>
              </div>
            </div>
          </section>

          {/* Collaborate Section */}
          <section className="feature">
            <div className="container">
              <div className="feature-details">
                <h2>Collaborate</h2>
                <p>
                  Connect with fellow innovators, form teams, and collaborate on
                  projects to bring your ideas to life! Utilize our platform to
                  find the right partners and resources for your next big
                  venture.Join our vibrant community of creators, where
                  collaboration knows no bounds. Share your vision, find
                  inspiration, and turn your dreams into reality with the
                  support of like-minded individuals. Let's innovate together
                  and make a lasting impact on the world,Explore endless
                  possibilities as you connect with fellow innovators from
                  diverse backgrounds and disciplines. From brainstorming
                  sessions to prototyping and beyond, our platform offers the
                  tools and support you need to turn your ideas into
                  groundbreaking projects. Together, let's push the boundaries
                  of what's possible and shape the future of innovation.
                </p>
              </div>
              <div className="feature-image">
                <img src={Collaborate} alt="Collaborate" />
              </div>
            </div>
          </section>

          {/* Discover Section */}

          <section className="feature alternate">
            <div className="container">
              <div className="feature-image">
                <img src={Discover} alt="Discover" />
              </div>
              <div className="feature-details" style={{ textAlign: "right" }}>
                <h2>Discover</h2>
                <p>
                  Stay updated with the latest trends, breakthroughs, and
                  innovations across various industries. Explore new ideas,
                  technologies, and possibilities that shape the future of
                  innovation. Absolutely, let's dive into the latest
                  advancements in AI, biotechnology, sustainable energy, space
                  exploration, and more. We'll uncover how these innovations are
                  revolutionizing industries and reshaping our world.From the
                  integration of augmented reality in everyday life to the
                  development of quantum computing, there's a myriad of
                  fascinating topics to explore. We'll also delve into the
                  ethical considerations surrounding emerging technologies and
                  how they impact society. Let's embark on this journey of
                  discovery together and stay ahead of the curve in the
                  ever-evolving landscape of innovation.
                </p>
              </div>
            </div>
          </section>
        </div>
        {/* About Us Section */}
        <section id="about" className="about-us">
          <div className="container">
            <h2>About Us</h2>
            <p>
              Operon is a platform dedicated to fostering innovation by
              providing a space where users can freely share their ideas,
              collaborate with others, and discover groundbreaking innovations.
            </p>
            <p>
              Our mission is to democratize innovation by breaking down barriers
              and connecting people with diverse backgrounds and expertise. We
              believe that great ideas can come from anyone, anywhere, and our
              platform aims to empower individuals to bring their ideas to life.
            </p>
            <p>
              Whether you're an aspiring entrepreneur, a seasoned innovator, or
              simply someone with a passion for creativity, Operon welcomes you
              to join our community and be part of the next wave of innovation.
            </p>
          </div>
        </section>
        {/* Team Section */}
        <section id="team" className="team">
          <div className="container">
            <h2>Our Team</h2>
            <div className="team-cards">
              {/* Team Member Cards */}
              {teamData.map((member) => (
                <div className="team-card" key={member.id}>
                  <img src={member.image} alt={member.name} />
                  <h3>{member.name}</h3>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Us Section */}
        <section id="contact" className="contact-us">
          <div className="container">
            <h2>Contact Us</h2>
            {/* Contact Form */}
            <form>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                disabled={disableSubmit}
                onClick={handleSubmit}
                className="submit-btn"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
        <footer>
          <div className="container">
            <p>&copy; 2024 Operon All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
