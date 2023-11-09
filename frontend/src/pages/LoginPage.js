import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { login } from "../api/AuthenticationAPI";

function LoginPage() {
    const [email, setEmail] = useState('david.lee@example.com');
    const [password, setPassword] = useState('S003');

    const handleLogin = async () => {
        await login(email, password)
            .then()
            .catch();
    }

    return (
        <Container fluid className="login-page">
            <Col xs={12} md={6} lg={4} className="login-section">
                <Form>
                    <Row>
                        <h2 className="my-4 text-center"><strong>Sign In</strong></h2>
                    </Row>
                    <Row>
                        <Form.Group className="mt-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                style={{ background: '#f0f0f0' }}
                                value={email}
                                onChange={e => (
                                    setEmail(e.target.value)
                                )}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mt-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                placeholder="Enter your password"
                                style={{ background: '#f0f0f0' }}
                                value={password}
                                onChange={e => (
                                    setPassword(e.target.value)
                                )}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mt-4 d-flex justify-content-center">
                        <Col xs={6}>
                            <Button variant="primary" type="submit" className="w-100" onClick={handleLogin}>
                                Login
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Container>
    );
}

export default LoginPage;
