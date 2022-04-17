import React, {useState, useEffect} from 'react'
import {Button, Col, Container, Form, Row, Nav} from "react-bootstrap";
import { Link } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    return localStorage.getItem("loggedIn") ? window.location.href = "/": null;
  }, [])

  const login = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({ email, password });
    console.log("RAW: ", body)
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body
    };
    fetch(`http://127.0.0.1:3002/login`, requestOptions)
        .then(response => {
            response.json()
                .then(result => {
                    console.log("RESULT: \n\n", result)
                    if(result.message == "done") {
                        localStorage.setItem("loggedIn", true)
                        localStorage.setItem("token", result.token)
                        window.location.href = "/"
                    } else if(result.message == "admin") {
                        localStorage.setItem("token", result.token)
                        localStorage.setItem("loggedIn", true)
                        localStorage.setItem("admin", true)
                        window.location.href = "/"
                    } else {
                        window.alert(result)
                    }
                })
        })
  }

  return (
    <>
        <Container>
            <h1 className="shadow-sm text-success mt-5 p-3 text-center rounded">Login</h1>
            <Row className="mt-5">
                <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-sm rounded-lg">
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        </Form.Group>

                        <Button onClick={login} variant="success btn-block">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
            <h6 className="mt-5 p-5 text-center text-secondary ">Don't have an account <Nav.Link as={Link} to="/Signup">Sign Up</Nav.Link>.</h6>
        </Container>
    </>
);
}

export default Login;