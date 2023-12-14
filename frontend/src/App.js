import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SamlRedirect from "./pages/Auth";
import PropTypes from 'prop-types';

import ProposalDetailsPage from "./pages/ProposalDetailsPage";
import StudentApplicationsPage from "./pages/StudentApplicationsPage";
import ApplicationDetails from "./pages/ApplicationDetailsPage";

import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { LoggedUserContext, LoggedUserProvider } from "./context/AuthenticationContext";
import { useContext, useEffect } from "react";
import { fetchCurrentUser } from "./api/AuthenticationAPI";
import ApplicationList from "./pages/ApplicationList";
import { VirtualClockProvider } from "./context/VirtualClockContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.css";
import StudentProposalsPage from "./pages/StudentProposalsPage";
import ProfessorProposalsPage from "./pages/ProfessorProposalsPage";

function App() {
    return (
        <BrowserRouter>
            <LoggedUserProvider>
                <VirtualClockProvider>
                    <Main />
                </VirtualClockProvider>
            </LoggedUserProvider>
        </BrowserRouter>
    );
}

function Main() {
    const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);    // context for logged user

    useEffect(() => {
        fetchCurrentUser()                        // reload current session, it gets the user information from the server
            .then(user => {
                setLoggedUser(user);
            })
            .catch(err => { });
    }, []);

    return (
        <Routes>
            <Route path='/' element={<PageLayout />} >
                <Route index path='/' element={loggedUser ? <HomePage /> : <SamlRedirect />} />
                <Route path='/applications'>
                    <Route index element={
                    	!loggedUser ? <UnAuthorizationPage /> :
                        	(loggedUser && loggedUser.role === 0) ? <ApplicationList /> : <StudentApplicationsPage />
                    } />
                    <Route path=":application_id" element={loggedUser && loggedUser.role === 0 ? <ApplicationDetails /> :<UnAuthorizationPage />} />
                </Route>
                <Route path="/proposals">
                    <Route index element={loggedUser ? (loggedUser.role === 1 ? <StudentProposalsPage /> : <ProfessorProposalsPage />) : <UnAuthorizationPage />} />
                    <Route path=":proposal_id" element={loggedUser ? <ProposalDetailsPage mode="read" /> : <UnAuthorizationPage />} />
                    <Route path="new" element={loggedUser && loggedUser.role === 0 ? <ProposalDetailsPage mode="add" /> : <UnAuthorizationPage />} />
                    <Route path=":proposal_id/update" element={loggedUser && loggedUser.role === 0 ? <ProposalDetailsPage mode="update" /> : <UnAuthorizationPage />} />
                    <Route path=":proposal_id/copy" element={loggedUser && loggedUser.role === 0 ? <ProposalDetailsPage  mode="copy" /> : <UnAuthorizationPage />} />
                </Route>
            </Route>

            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

function PageLayout() {
    return (
        <Row  className="page-content w-100 m-0">
            <Outlet />
        </Row>
    );
}

/**
 * Informs the user that he does not have authorization for this page
 */
export function UnAuthorizationPage({error, message}) {
    const titleMessage = error || "Access Not Authorized";
    const bodyMessage = message || "You are not allowed to access this page!";

    return (
        <Container className="text-center" >
            <Row>
                <Col>
                    <Alert variant="danger">
                        <h3><strong>{titleMessage}</strong></h3>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3">
                        <p className="lead">
                            {bodyMessage}
                        </p>
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
    );
}

UnAuthorizationPage.propTypes = {
    error: PropTypes.string,
    message: PropTypes.string
}

/**
* Informs the user that the route is not valid
*/
function NotFoundPage() {
    return (
        <Container className="text-center" >
            <Row>
                <Col>
                    <Alert variant="danger">
                        <h3><strong>The page cannot be found</strong></h3>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3">
                        <p className="lead">
                            The requested page does not exist, please go back to the{' '}
                            <Link to="/">home</Link>.
                        </p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
