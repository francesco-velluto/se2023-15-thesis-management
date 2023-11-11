import { useContext, useEffect } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthenticationAPI from "../api/AuthenticationAPI";

function HomePage() {
    const { loggedUser, handleLogout } = useContext(LoggedUserContext);

    const navigate = useNavigate();

    // TODO - this is an example of usage of the API using then/catch instead of async/await, remove it when you start working on the project
    const fetchLogin = () => {
        AuthenticationAPI.login('admin', 'admin')
            .then(async response => {
                let data = await response.json();

                if (response.ok) {
                    console.log("token: " + data.token);
                } else {
                    console.error("error: " + data.error);
                }
            })
            .catch(error => {
                console.error("error in fetch login: " + error);
            });
    };

    useEffect(() => {
        fetchLogin();
    }, []);

    useEffect(() => {
        //TODO: If user logged in, go to proposals list, otherwise go to login page
        navigate("/proposals");
    }, []);

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