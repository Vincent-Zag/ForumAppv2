import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavComponent from "./NavComponent";
import Likes from "../utils/Likes";
import Comments from "../utils/Comments";
import "../styles/Home.css";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

const Home = () => {
	const [thread, setThread] = useState("");
	const [threadList, setThreadList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const checkUser = () => {
			if (!localStorage.getItem("_id")) {
				navigate("/");
			} else {
				fetch("http://localhost:4000/api/all/threads")
					.then((res) => res.json())
					.then((data) => {
						console.log("Received data:", data);
						setThreadList(data.threads || []);
					})
					.catch((err) => console.error(err));
			}
		};
		checkUser();
	}, [navigate]);

	const createThread = () => {
		fetch("http://localhost:4000/api/create/thread", {
			method: "POST",
			body: JSON.stringify({
				thread,
				id: localStorage.getItem("_id"),
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				alert(data.message);
				setThreadList(data.threads || []);
				window.location.reload();
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		createThread();
		setThread("");
	};

	return (
		<>
			<NavComponent />
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
						{/* <Form.Group className="mb-3" controlId="textarea">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Description"
							/>
						</Form.Group> */}
					</Form>
				</Card.Body>
			</Card>

			<Card className="thread-container">
				<Card.Body style={{ width: "100%" }}>
					<Card.Title className="container-title thread-title">
						Threads
					</Card.Title>
					{threadList.map((thread) => (
						<Card
							className="thread__item"
							key={thread._id}
							style={{ width: "100%" }}
						>
							<Row>
								<Col className="thread-item-title">
									<p>{thread.title}</p>
								</Col>
								<Col xs={1} className="react__container">
									{thread.likes && (
										<Likes
											numberOfLikes={thread.likes.length}
											threadId={thread._id}
										/>
									)}
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
							</Row>
						</Card>
					))}
				</Card.Body>
			</Card>
		</>
	);
};

export default Home;
