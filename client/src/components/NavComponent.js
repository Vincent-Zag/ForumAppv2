import React, { useState, useEffect } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/NavComponent.css";

const NavComponent = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleLanding = (e) => {
    navigate("/landing");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleProfile = (e) => {
    
    e.preventDefault();
    if (userId) {
      navigate(`/profile/${userId}`);
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
