import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/Register.css";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import NavComponent from "./NavComponent";

const Register = (props) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const signUp = () => {
		fetch("http://localhost:4000/api/register", {
			method: "POST",
			body: JSON.stringify({
				email,
				password,
				username,
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
					alert("Account created successfully!");
					navigate("/");
				}
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		signUp();
		setEmail("");
		setUsername("");
		setPassword("");
	};
	return (
		<>
			<NavComponent setUserId={props.setUserId} userId={props.userId} />
			<Card className="test">
				<Card.Body>
					<Card.Title className="testTitle">Register</Card.Title>
					<Form className="formTest" onSubmit={handleSubmit}>
						<Form.Group
							className="mb-3"
							controlId="formBasicUsername"
						>
							<FloatingLabel
								controlId="floatingUsername"
								label="Username"
							>
								<Form.Control
									className="registerInput"
									type="username"
									placeholder="Username"
									name="username"
									required
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicEmail">
							<FloatingLabel
								controlId="floatingInput"
								label="Email"
								className="mb-3"
							>
								<Form.Control
									className="registerInput"
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
							<Form.Text id="passwordHelpBlock" muted>
								This is where I'd put descriptions on password
								restrictions.
							</Form.Text>
						</Form.Group>
						<div className="d-grid gap-2">
							<Button
								className="registerButton"
								variant="primary"
								type="submit"
							>
								Create Account
							</Button>
							<p>
								Have an account?{" "}
								<Link to="/login">Sign in</Link>
							</p>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
};

export default Register;
