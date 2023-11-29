import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

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
                <Route index path='/' element={loggedUser ? <HomePage /> : <LoginPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/applications'>
                    <Route index element={
                    	!loggedUser ? <UnAuthorizationPage error={"Access Not Authorized"} message={"You are not allowed to access this page"} /> :
                        	(loggedUser && loggedUser.role === 0) ? <ApplicationList /> : <StudentApplicationsPage />
                    } />
                    <Route path=":application_id" element={loggedUser && loggedUser.role === 0 ? <ApplicationDetails /> :<UnAuthorizationPage error={"Access Not Authorized"} message={"You are not allowed to access this page"} />} />
                </Route>
                <Route path="/proposals">
                    <Route index element={loggedUser ? (loggedUser.role === 1 ? <StudentProposalsPage /> : <ProfessorProposalsPage />) : <UnAuthorizationPage error={"Access Not Authorized"} message={"You are not allowed to access this page"}/>} />
                    <Route path=":proposal_id" element={loggedUser ? <ProposalDetailsPage mode={0} /> : <UnAuthorizationPage error={"Access Not Authorized"} message={"You are not allowed to access this page"} />} />
                    <Route path="new" element={loggedUser && loggedUser.role === 0 ? <ProposalDetailsPage mode={2} /> : <UnAuthorizationPage error={"Access Not Authorized"} message={"You are not allowed to access this page"} />} />
                </Route>
            </Route>

            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

function PageLayout() {
    return (
        <Row style={{backgroundColor:"#F4EEE0"}} className="page-content w-100 m-0">
            <Outlet />
        </Row>
    );
}

/**
 * Informs the user that he does not have authorization for this page
 */
export function UnAuthorizationPage({error, message}) {
    return (
        <Container className="text-center" style={{ paddingTop: '5rem', backgroundColor:"#F4EEE0"}}>
            <Row>
                <Col>
                    <Alert variant="danger">
                        <h3><strong>{error}</strong></h3>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3">
                        <p className="lead">
                            {message}
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

/**
* Informs the user that the route is not valid
*/
function NotFoundPage() {
    return (
        <Container className="text-center" style={{ paddingTop: '5rem', backgroundColor:"#F4EEE0"}}>
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
                        <p className="lead fs-4">
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
