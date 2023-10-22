import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavComponent from "./NavComponent";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import "../styles/Replies.css";

const Replies = (props) => {
	const [replyList, setReplyList] = useState([]);
	const [reply, setReply] = useState("");
	const [title, setTitle] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();
	const [authenticated, setAuthenticated] = useState(false); // Add this state

	useEffect(() => {
		// Check if the user is authenticated
		fetch("http://localhost:4000/api/user/authenticated", {
			method: "GET",
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				setAuthenticated(data.authenticated);
				console.log("Is authenticated:", data.authenticated);
			})
			.catch((err) => console.error(err));
	}, []);

	const addReply = () => {
		if (!authenticated) {
			alert("You need to be authenticated to add a reply.");
			return;
		}

		console.log("Thread ID:", id);

		fetch("http://localhost:4000/api/create/reply", {
			method: "POST",
			body: JSON.stringify({
				id: id,
				userId: localStorage.getItem("userId"),
				reply,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				alert(data.message);
				fetchReplies();
			})
			.catch((err) => {
				console.error(err);
				console.log("Reply failed with error:", err);
			});
	};

	const handleSubmitReply = (e) => {
		e.preventDefault();
		addReply();
		setReply("");
	};

	const fetchReplies = () => {
		fetch(`http://localhost:4000/api/thread/replies/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setReplyList(data.replies);
				setTitle(data.title);
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetchReplies();
	}, [id]);

	return (
		<>
			<NavComponent setUserId={props.setUserId} userId={props.userId} />
			<main className="replies">
				{/* <h1 className="repliesTitle">{title}</h1> */}

				<Card className="thread__container">
					<Card.Title className="container-title">{title}</Card.Title>
					{replyList
						.slice()
						.reverse()
						.map((reply) => (
							<div className="thread__item">
								<p>{reply.text}</p>
								<div className="react__container">
									<p style={{ opacity: "1" }}>
										by {reply.name}
									</p>
								</div>
							</div>
						))}

					<Form className="reply-form" onSubmit={handleSubmitReply}>
						<Form.Group className="mb-3">
							<Form.Label>Reply to the thread</Form.Label>
							<Form.Control
								type="textarea"
								name="reply"
								value={reply}
								onChange={(e) => setReply(e.target.value)}
							/>
						</Form.Group>
						<Button type="submit">Reply</Button>
					</Form>
				</Card>

				<Card></Card>
			</main>
		</>
	);
};

export default Replies;
