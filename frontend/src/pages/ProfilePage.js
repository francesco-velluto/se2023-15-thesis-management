import { useContext } from "react";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

function ProfilePage() {
  const { loggedUser } = useContext(LoggedUserContext);

  return (
    <>
      <NavbarContainer />
      <TitleBar />
      <Container fluid className="home-page">
        <Row className="profile-page-content p-3">
          {loggedUser && (
            <Card bg="light" className="rounded p-4">
              <Row>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="currentColor"
                  className="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
              </Row>
              <Row className="text-center my-3">
                <h2>
                  <b>{loggedUser.name + " " + loggedUser.surname}</b>
                </h2>
              </Row>
              <Form>
                <Form.Group as={Row} className="mt-2">
                  <Col sm={4}>
                    <Form.Label column>
                      <b>ID:</b>
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      value={loggedUser.id}
                      readOnly
                      plaintext
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mt-2">
                  <Col sm={4}>
                    <Form.Label column>
                      <b>Email:</b>
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      value={loggedUser.email}
                      readOnly
                      plaintext
                    />
                  </Col>
                </Form.Group>
                {loggedUser.cod_group && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Group:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.cod_group}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
                {loggedUser.cod_department && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Department:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.cod_department}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
                {loggedUser.gender && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Gender:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.gender}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
                {loggedUser.nationality && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Nationality:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.nationality}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
                {loggedUser.cod_degree && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Code Degree:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.cod_degree}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
                {loggedUser.enrollment_year && (
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={4}>
                      <Form.Label column>
                        <b>Enrollment Year:</b>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={loggedUser.enrollment_year}
                        readOnly
                        plaintext
                      />
                    </Col>
                  </Form.Group>
                )}
              </Form>
            </Card>
          )}
        </Row>
        <Row className="m-4 p-3">
          {!loggedUser && (
            <Button as={Link} to={"/login"}>
              Login
            </Button>
          )}
        </Row>
      </Container>
      <footer>
        <Col xs={12} sm={2}>
          <img src="logo.svg" alt="logo" />
        </Col>
        <Col xs={12} sm={10}>
          <span className="text-secondary footer-text">
            &copy; {new Date().getFullYear()} All rights reserved. Developed by
            Group 15 of the Politecnico of Turin.
          </span>
        </Col>
      </footer>
    </>
  );
}

export default ProfilePage;
