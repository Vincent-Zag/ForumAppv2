import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavComponent from "./NavComponent";
import Likes from "../utils/Likes";
import Comments from "../utils/Comments";
import "../styles/Home.css";
import { Card, Form, Button, Row, Col, Container } from "react-bootstrap";

const Home = (props) => {
	const [thread, setThread] = useState("");
	const [threadList, setThreadList] = useState([]);
	const [authenticated, setAuthenticated] = useState(false); // Add authenticated state
	const navigate = useNavigate();

	useEffect(() => {
		const checkUser = () => {
			fetch("http://localhost:4000/api/all/threads")
				.then((res) => res.json())
				.then((data) => {
					setThreadList(data.threads || []);
				})
				.catch((err) => console.error(err));
		};

		checkUser();

		// Check if the user is authenticated
		fetch("http://localhost:4000/api/user/authenticated", {
			method: "GET",
			credentials: "include", // Include credentials for the session
		})
			.then((res) => res.json())
			.then((data) => {
				setAuthenticated(data.authenticated);
			})
			.catch((err) => console.error(err));
	}, [navigate]);

	const createThread = () => {
		fetch("http://localhost:4000/api/create/thread", {
			method: "POST",
			body: JSON.stringify({
				thread,
				userId: localStorage.getItem("userId"),
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setThreadList([...threadList, data.thread]);
					setThread("");
				}
				alert("Thread created successfully!");
				window.location.reload();
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (authenticated) {
			createThread();
			setThread("");
		} else {
			alert("You need to be authenticated to create a thread.");
		}
	};

	return (
		<>
			<NavComponent setUserId={props.setUserId} userId={props.userId} />
			<Card className="create-thread-container">
				<Card.Body>
					<Card.Title className="container-title">
						Create a Thread
					</Card.Title>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Col>
								<Form.Group
									className="mb-3"
									controlId="formBasicEmail"
								>
									<Form.Label>Title</Form.Label>
									<Form.Control
										type="input"
										placeholder="Title"
										className="input-thread-title"
										value={thread}
										onChange={(e) =>
											setThread(e.target.value)
										}
									/>
								</Form.Group>
							</Col>
							<Col className="button-col">
								<Button
									variant="primary"
									type="submit"
									className="thread-button"
								>
									Create Thread
								</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>

			<Card className="thread-container">
				<Card.Body style={{ width: "100%" }}>
					<Card.Title className="container-title thread-title">
						Threads
					</Card.Title>
					{threadList.map((thread) => (
						<Container className="thread" key={thread._id}>
							<Row className="thread-info">
								<Col xs="auto" className="thread-icon">
									{thread.likes && (
										<Likes
											numberOfLikes={thread.likes.length}
											threadId={thread._id}
										/>
									)}
								</Col>
								<Col xs="auto" className="thread-icon">
									{thread.replies && (
										<Comments
											numberOfComments={
												thread.replies.length
											}
											threadId={thread._id}
											title={thread.title}
										/>
									)}
								</Col>
								<Col>{thread.title}</Col>
							</Row>
						</Container>
					))}
				</Card.Body>
			</Card>
		</>
	);
};

export default Home;
