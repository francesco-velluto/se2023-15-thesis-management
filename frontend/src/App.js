import { Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<PageLayout />} >
                    <Route index path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </>
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
                        <img src="logo.svg" alt="logo" />
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
