import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";

import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { LoggedUserContext, LoggedUserProvider } from "./context/AuthenticationContext";
import { useContext, useEffect } from "react";
import { fetchCurrentUser } from "./api/AuthenticationAPI";
import ApplicationList from "./pages/ApplicationList";
import { VirtualClockProvider } from "./components/VirtualClockContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/index.css";

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
                <Route path='/applications' element={(loggedUser && loggedUser.role === 0) ? <ApplicationList /> : <UnAuthorizationPage />} />
                <Route path="/proposals">
                    <Route index element={loggedUser && loggedUser.role === 1 ? <ProposalsPage /> : <UnAuthorizationPage />} />
                    <Route path=":proposal_id" element={loggedUser && loggedUser.role === 1 ? <ProposalDetailsPage mode={0} /> : <UnAuthorizationPage />} />
                    <Route path="new" element={loggedUser && loggedUser.role === 0 ? <ProposalDetailsPage mode={2} /> : <UnAuthorizationPage />} />
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
function UnAuthorizationPage() {
    return (
        <Container className="text-center" style={{ paddingTop: '5rem', backgroundColor:"#F4EEE0"}}>
            <Row>
                <Col>
                    <Alert variant="danger">
                        <h3><strong>Access Not Authorized</strong></h3>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card bg="light" className="rounded p-3">
                        <p className="lead fs-4">
                            You are not allowed to access this page, please go back to the{' '}
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
