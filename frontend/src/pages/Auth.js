import React, { useContext, useEffect, useState } from 'react';
import { APICall } from '../api/GenericAPI';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';

const APIConfig = require('../api/api.config.js');
const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';

function SamlRedirect() {
    const [errors, setErrors] = useState(undefined);

    const { setLoggedUser } = useContext(LoggedUserContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await APICall(AuthenticationAPIURL + '/whoami');
            setLoggedUser(response.user);
            navigate("/");
        } catch (err) {
            console.log(err);
            setErrors((old) => [ ...old, err.message ]);
            window.location.replace('http://localhost:8080/api/authentication/login');
        }
    }

    useEffect(() => {
        handleLogin();
    }, []);

    return (
    <>
        {errors && errors.length > 0 ? (
        <Container className="text-center" style={{ paddingTop: '5rem', backgroundColor: "#F4EEE0" }}>
            <Row>
                <Col>
                    <Alert variant="danger">
                        <h3><strong>Error!</strong></h3>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3">
                        {
                            errors?.map((error, index) =>
                                <p key={index} className='lead'> {error} </p>
                            )}
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3 mt-2">
                        <p className="lead">
                            Please go back to the{' '}
                            <Link to="/">home</Link>.
                        </p>
                    </Card>
                </Col>
            </Row>
        </Container>
    ) : (
        <p>Redirecting to Auth0...</p>
    )}
</>
);
}

export default SamlRedirect;