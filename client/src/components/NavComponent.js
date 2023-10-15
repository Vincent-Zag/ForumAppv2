import React from "react";
import { Navbar, Container, NavDropdown, Form, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import "../styles/NavComponent.css";

const NavComponent = () => {
	const navigate = useNavigate();

	const handleLanding = (e) => {
		navigate("/landing");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/dashboard");
	};

	const signOut = () => {
		localStorage.removeItem("_id");
		navigate("/");
	};

	return (
		// <nav className="navbar">
		// 	<div className="'navbarLeft">
		// 		<h2 onClick={handleSubmit}>User Profile</h2>
		// 	</div>
		// 	<div className="navbarRight">
		// 		<button onClick={signOut}>Sign out</button>
		// 	</div>
		// </nav>
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
						<Nav.Link href="#link">Profile</Nav.Link>
						{/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">
								Action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">
								Something
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">
								Separated link
							</NavDropdown.Item>
						</NavDropdown> */}
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
