import React, { useState, useEffect } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/NavComponent.css";

const NavComponent = (props) => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    fetch("http://localhost:4000/api/user/authenticated", {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        props.setUserId(data.userId);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLanding = (e) => {
    navigate("/landing");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleProfile = (e) => {
    e.preventDefault();
    console.log(props.userId); // Check if userId is defined
    if (props.userId) {
      navigate(`/${props.userId}/profile`, {state:{authenticated}});
    }
  };

  const signOut = () => {
    // Clear the user ID from local storage
    navigate(`/api/logoff`);
    // Navigate to the landing page or any other appropriate route
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="navbar navbar-expand-lg bg-primary navbar-custom"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand href="#home" onClick={handleLanding}>
          Forum App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={handleSubmit}>
              Home
            </Nav.Link>
            <Nav.Link href="#profile" onClick={handleProfile}>
              Profile
            </Nav.Link>
          </Nav>
          <Button type="submit" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavComponent;
