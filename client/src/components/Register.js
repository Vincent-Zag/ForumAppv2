import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import "../styles/Register.css"

const Register = () => {
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
            <Container className="d-flex align-items-center register">
                <Card className="regCard">
                    <Row className="reg-row">
                        <Container className="mt-5">
                            <h1 className='registerTitle'>Register</h1>
                            <p>
                                Already have an account? <Link to='/'>Login</Link>
                            </p>
                        </Container>

                        <Container>
                            <Form className="registerForm" onSubmit={handleSubmit}>

                                <Form.Group className="mt-4 mb-4">
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='username'
                                        id='username'
                                        required
                                        value={username}
                                        placeholder="Enter a Username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mt-4 mb-4">
                                    <Form.Label htmlFor='email'>Email Address:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='email'
                                        id='email'
                                        required
                                        value={email}
                                        placeholder="Enter an Email Address"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mt-4 mb-4">
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='password'
                                            name='password'
                                            id='password'
                                            required
                                            value={password}
                                            placeholder="Enter a Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Button className='registerBtn' type='submit'>Create Account!</Button>
                            </Form>
                        </Container>
                    </Row>
                </Card>
            </Container>
        </>
    );
};

export default Register;