import { useContext, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { LoggedUserContext } from "../api/Context";

function LoginPage() {
    const [username, setUsername] = useState('michael.wilson@example.com');         // useState('david.lee@example.com'); 
    const [password, setPassword] = useState('T002');                               // useState('S003');  
    const [disableButtonSubmit, setDisableButtonSubmit] = useState(true);

    const { handleLogin, errors, setErrors } = useContext(LoggedUserContext);    // context for logged user  

    const regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^[a-zA-Z\d]{4,}$/;

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    }

    return (
        <Container fluid className="login-page">
            <Col xs={12} md={6} lg={4} className="login-section">
                {errors?.map((error, index) => (
                    <Alert variant='danger'
                        dismissible={true}
                        onClose={() => setErrors(undefined)}
                        sx={{ marginBottom: '1.5rem' }}
                        key={index}>
                        {error}
                    </Alert>
                ))}
                <Form>
                    <Row>
                        <h2 className="my-4 text-center"><strong>Sign In</strong></h2>
                    </Row>
                    <Row>
                        <Form.Group className="mt-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                style={{ background: '#f0f0f0' }}
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value);
                                    setDisableButtonSubmit(true);
                                    if (e.target.value !== '' && regexEmail.test(e.target.value) && regexPassword.test(password)) {
                                        setDisableButtonSubmit(false);
                                    }
                                }}
                                required
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
                                onChange={e => {
                                    setPassword(e.target.value);
                                    setDisableButtonSubmit(true);
                                    if (e.target.value !== '' && regexPassword.test(e.target.value) && regexEmail.test(username)) {
                                        setDisableButtonSubmit(false);
                                    }
                                }}
                                required
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mt-4 d-flex justify-content-center">
                        <Col xs={6}>
                            <Button variant="primary" type="submit" className="w-100" disabled={disableButtonSubmit} onClick={handleSubmitLogin}>
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
