import React, { useContext, useEffect, useState } from 'react';
import { APICall } from '../api/GenericAPI';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { Link, useNavigate } from 'react-router-dom';
import {Alert, Card, Col, Container, Row, Spinner} from 'react-bootstrap';
import GenericLoading from "../components/GenericLoading";

const APIConfig = require('../api/api.config.js');
const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';

function SamlRedirect() {
    const [errors, setErrors] = useState(undefined);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const { setLoggedUser } = useContext(LoggedUserContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        await setIsLoadingUser(true);

        try {
            const response = await APICall(AuthenticationAPIURL + '/whoami');
            await setLoggedUser(response.user);
            navigate("/");
        } catch (err) {
            console.log(err);

            // if it is a simple error of not authenticated, redirect to the login page without showing the error, if not show errors
            if (!(err.length === 1 && err[0] === 'Not authorized')) {
                await setErrors(err);
            }

            window.location.replace('http://localhost:8080/api/authentication/login');
        }

        await setIsLoadingUser(false);
    }

    useEffect(() => {
        handleLogin();
    }, []);

    return ( isLoadingUser ?
        <GenericLoading />
        :
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
          <GenericLoading text={"Redirecting to the authentication page"}/>
    )}
</>
);
}

export default SamlRedirect;