import { useContext } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";


function HomePage() {
    const { loggedUser, handleLogout } = useContext(LoggedUserContext);

    return (
        <Container className="home-page">
            <Row className="mt-3">
                <h1><strong>Thesis Management System</strong></h1>
            </Row>
            <Row className="mt-4">
                {loggedUser &&
                    <>
                        <Card bg="light" className="rounded p-3">
                            <h2>Hi <strong>{loggedUser.name + " " + loggedUser.surname}</strong></h2>
                            <ul style={{ marginLeft: '20px', fontSize: '20px' }}>
                                <li>id: {loggedUser.id} </li>
                                <li>email: {loggedUser.email} </li>
                                {loggedUser.cod_group && <li>cod group: {loggedUser.cod_group} </li>}
                                {loggedUser.cod_department && <li>cod department: {loggedUser.cod_department} </li>}
                                {loggedUser.gender && <li>gender: {loggedUser.gender} </li>}
                                {loggedUser.nationality && <li>nationality: {loggedUser.nationality} </li>}
                                {loggedUser.cod_degree && <li>cod degree: {loggedUser.cod_degree} </li>}
                                {loggedUser.enrollment_year && <li>enrollment year: {loggedUser.enrollment_year} </li>}
                            </ul>
                        </Card>
                        <Button className="mt-3" onClick={handleLogout}>Logout</Button>
                        <Button className="mt-4" as={Link} to="/applications">My Thesis Proposal with Applications</Button>
                    </>
                }
            </Row>
            <Row className="mt-4">
                {!loggedUser &&
                    <Button as={Link} to={"/login"} >Login</Button>
                }
            </Row>
            <Row>
                <footer>
                    <Col className="pr-3" xs={2}>
                        <img src="logo.svg" alt="logo" />
                    </Col>
                    <Col xs={10}>
                        <span className="text-secondary footer-text">
                            &copy; {new Date().getFullYear()} All rights reserved. Developed by Group 15 of the Politecnico of Turin.
                        </span>
                    </Col>
                </footer>
            </Row>
        </Container>
    );
}

export default HomePage;