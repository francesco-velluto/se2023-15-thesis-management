import { useContext } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
    const { loggedUser, handleLogout } = useContext(LoggedUserContext);

    return (
        <>
            <Container fluid className="home-page">
                <Row className="mt-3">
                    <h1><strong>Thesis Management System</strong></h1>
                </Row>
                <Row className="mt-4">
                    {loggedUser &&
                        <>
                            <Card bg="light" className="rounded p-3">
                                <h2>Hi <strong>{loggedUser.name + " " + loggedUser.surname}</strong></h2>
                                <Form>
                                    <Form.Group as={Row} className='mt-2'>
                                        <Col xs={12} sm={2}>
                                            <Form.Label column>
                                                <strong>Id:</strong>
                                            </Form.Label>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Form.Control
                                                type='text'
                                                value={loggedUser.id}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className='mt-2'>
                                        <Col xs={12} sm={2}>
                                            <Form.Label column>
                                                <strong>Email:</strong>
                                            </Form.Label>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Form.Control
                                                type='text'
                                                value={loggedUser.email}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>
                                    {loggedUser.cod_group &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Group Code:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.cod_group}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                    {loggedUser.cod_department &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Code Department:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.cod_department}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                    {loggedUser.gender &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Gender:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.gender}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                    {loggedUser.nationality &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Nationality:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.nationality}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                    {loggedUser.cod_degree &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Code Degree:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.cod_degree}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                    {loggedUser.enrollment_year &&
                                        <Form.Group as={Row} className='mt-2'>
                                            <Col xs={12} sm={2}>
                                                <Form.Label column>
                                                    <strong>Enrollment Year:</strong>
                                                </Form.Label>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Form.Control
                                                    type='text'
                                                    value={loggedUser.enrollment_year}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>}
                                </Form>

                                <ul style={{ marginLeft: '20px', fontSize: '20px' }}>
                                </ul>
                            </Card>
                            <Card bg="light" className="rounded p-3 mt-3">
                                <Row>
                                    {loggedUser.role === 0 &&
                                        <Col>
                                            <Button className="w-100" as={Link} to="/applications">My Thesis Applications</Button>
                                        </Col>}
                                    {
                                        loggedUser.role === 0 &&
                                        <Col>
                                            <Button className="w-100" as={Link} to="/proposals/new">Add a new proposal</Button>
                                        </Col>
                                    }
                                    {loggedUser.role === 1 &&
                                        <Col>
                                            <Button className="w-100" as={Link} to="/proposals">Thesis proposals</Button>
                                        </Col>}
                                    
                                </Row>


                            </Card>
                            <Button className="mt-3" variant="danger" onClick={handleLogout}>Logout</Button>
                        </>
                    }
                </Row>
                <Row className="mt-4">
                    {!loggedUser &&
                        <Button as={Link} to={"/login"}>Login</Button>
                    }
                </Row>

            </Container>
            <Row className="w-100">
                <footer>
                    <Col className="pr-3" xs={12} sm={2}>
                        <img src="logo.svg" alt="logo" />
                    </Col>
                    <Col xs={12} sm={10}>
                        <span className="text-secondary footer-text">
                            &copy; {new Date().getFullYear()} All rights reserved. Developed by Group 15 of the Politecnico of Turin.
                        </span>
                    </Col>
                </footer>
            </Row>
        </>
    );
}

export default HomePage;