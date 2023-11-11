import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailsPage from "./pages/ProposalDetailsPage";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { LoggedUserContext, LoggedUserProvider } from "./api/Context";
import { useContext, useEffect } from "react";
import { fetchCurrentUser } from "./api/AuthenticationAPI";

function App() {
    return (
        <BrowserRouter>
            <LoggedUserProvider>
                <Main />
            </LoggedUserProvider>
        </BrowserRouter>
    );
}

function Main() {
    const { setLoggedUser } = useContext(LoggedUserContext);    // context for logged user  

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
                <Route index path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
            </Route>
            <Route path="/proposals" element={<PageLayout />}>
                <Route index element={<ProposalsPage />} />
                <Route path=":proposal_id" element={<ProposalDetailsPage />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

function PageLayout() {
    return (
        <Container className="page-layout">
            <Row>
                <Outlet />
            </Row>
            <Row>
                <footer>
                    <Col className="pr-3" xs={1}>
                        <img src="/logo.svg" alt="logo" />
                    </Col>
                    <Col xs={11}>
                        <span className="text-secondary">
                            &copy; {new Date().getFullYear()} All rights reserved. Developed by Group 15 of the Politecnico of Turin.
                        </span>
                    </Col>
                </footer>
            </Row>
        </Container>
    );
}

function UnAuthorizationPage() {
    return (
        <></>
    );
}

/**
* Informs the user that the route is not valid
*/
function NotFoundPage() {
    return (
        <></>
    );
}

export default App;
