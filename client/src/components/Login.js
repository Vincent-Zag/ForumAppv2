import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../styles/Login.css";
import NavComponent from "./NavComponent";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const loginUser = () => {
		fetch("http://localhost:4000/api/login", {
			method: "POST",
			body: JSON.stringify({
				email,
				password,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error_message) {
					alert(data.error_message);
				} else {
					alert(data.message);
					navigate("/dashboard");
					localStorage.setItem("_id", data.id);
				}
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		loginUser();
		setEmail("");
		setPassword("");
	};

	return (
		<>
			<NavComponent />
			<Card className="testLogin">
				<Card.Body>
					<Card.Title className="testTitle">Login</Card.Title>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<FloatingLabel
								controlId="floatingInput"
								label="Email"
								className="mb-3"
							>
								<Form.Control
									className="loginInput"
									type="email"
									placeholder="Email"
									name="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group
							className="mb-3"
							controlId="formBasicPassword"
						>
							<FloatingLabel
								controlId="floatingPassword"
								label="Password"
							>
								<Form.Control
									className="loginInput"
									type="password"
									placeholder="Password"
									name="password"
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</FloatingLabel>
						</Form.Group>
						<div className="d-grid gap-2">
							<Button variant="primary" type="submit">
								Submit
							</Button>
							<p>
								Don't have an account?{" "}
								<Link to="/register">Create one</Link>
							</p>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
};

export default Login;
