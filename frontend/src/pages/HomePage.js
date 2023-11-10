import { useContext } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";


function HomePage() {
    const { loggedUser } = useContext(LoggedUserContext);

    return (
        <Container className="home-page">
            <Row>
                <h1>Thesis Management System</h1>
            </Row>
            <Row className="mt-4">
                {loggedUser &&
                    <>
                        <h2>Hi {loggedUser.name + " " + loggedUser.surname} </h2>
                        <ul style={{ marginLeft: '20px', fontSize: '20px' }}>
                            <li>student id: {loggedUser.student_id} </li>
                            <li>gender: {loggedUser.gender} </li>
                            <li>email: {loggedUser.email} </li>
                            <li>nationality: {loggedUser.nationality} </li>
                            <li>cod degree: {loggedUser.cod_degree} </li>
                            <li>enrollment year: {loggedUser.enrollment_year} </li>
                        </ul>
                        <Button>Logout</Button>
                    </>
                }
            </Row>
            <Row className="mt-4">
                {!loggedUser &&
                    <Button as={Link} to={"/login"}>Login</Button>
                }
            </Row>
        </Container>
    );
}

export default HomePage;