import React from "react";
import Nav from "./Nav";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "../styles/Landing.css";
import forumImage from "../assets/forum.jpg";
import topicImage from "../assets/idea.png";
import cloudImage from "../assets/cloud.png";
import securityImage from "../assets/security.png";
import { Link, useNavigate } from "react-router-dom";

function Landing() {
	const navigate = useNavigate();

	return (
		<>
			<Nav />
			<Container>
				<Row className="top-row">
					<Col className="call-to-action">
						<div>
							<h2>Innovate. Inspire. Share.</h2>
							<p>
								I am a pretentious block of text that will
								explain why this app is iportant to your life
								and will change it for the better.
							</p>
							<Link to="/dashboard">
								<Button>Browse</Button>
							</Link>
						</div>
					</Col>
					<Col className="right-aligned-col">
						<img
							src={forumImage}
							alt="Forum Image"
							style={{ width: "960px", height: "608.5px" }}
						/>
					</Col>
				</Row>
				<Row className="bottom-row">
					<Col>
						<Card
							style={{ width: "18rem" }}
							className="centered-card"
						>
							<Card.Img
								variant="top"
								src={topicImage}
								style={{ width: "200px", height: "200px" }}
							/>
							<Card.Body>
								<Card.Title>Browse Content By Topic</Card.Title>
								<Card.Text>
									Browse content based on categories for
									discussion.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ width: "18rem" }}
							className="centered-card"
						>
							<Card.Img
								variant="top"
								src={cloudImage}
								style={{ width: "200px", height: "200px" }}
							/>
							<Card.Body>
								<Card.Title>Secure in the Cloud</Card.Title>
								<Card.Text>
									Data is secure using modern cloud
									technology.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card
							style={{ width: "18rem" }}
							className="centered-card"
						>
							<Card.Img
								variant="top"
								src={securityImage}
								style={{ width: "200px", height: "200px" }}
							/>
							<Card.Body>
								<Card.Title>JWT Authorization</Card.Title>
								<Card.Text>
									Forum use is secure and only authorized
									users can post.
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Landing;