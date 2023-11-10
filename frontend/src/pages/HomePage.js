import { useContext } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";


function HomePage() {
    const { loggedUser, handleLogout } = useContext(LoggedUserContext);

    console.log(loggedUser);

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
                            <li>id: {loggedUser.id} </li>
                            <li>email: {loggedUser.email} </li>
                            {loggedUser.cod_group && <li>gender: {loggedUser.cod_group} </li>}
                            {loggedUser.cod_department && <li>gender: {loggedUser.cod_department} </li>}
                            {loggedUser.gender && <li>gender: {loggedUser.gender} </li>}
                            {loggedUser.nationality && <li>nationality: {loggedUser.nationality} </li>}
                            {loggedUser.cod_degree && <li>cod degree: {loggedUser.cod_degree} </li>}
                            {loggedUser.enrollment_year && <li>enrollment year: {loggedUser.enrollment_year} </li>}
                        </ul>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                }
            </Row>
            <Row className="mt-4">
                {!loggedUser &&
                    <Button as={Link} to={"/login"} >Login</Button>
                }
            </Row>
        </Container>
    );
}

export default HomePage;