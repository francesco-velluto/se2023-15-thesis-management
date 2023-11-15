import { useContext } from "react";
import { LoggedUserContext } from "../api/Context";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  const { loggedUser, handleLogout } = useContext(LoggedUserContext);

  return (
    <>
      <Container fluid className="home-page">
        <Row className="m-3 mt-5">
          <h1>
            <b>Thesis Management System</b>
          </h1>
        </Row>
        <Row className="home-page-content p-3">
          {loggedUser && (
            <>
              <Card bg="light" className="rounded p-4">
                <h2>
                  Hi <b>{loggedUser.name + " " + loggedUser.surname}</b>
                </h2>
                <Form>
                  <Form.Group as={Row} className="mt-2">
                    <Col sm={3}>
                      <Form.Label column>
                        <b>Id:</b>
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
                    <Col sm={3}>
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
                      <Col sm={3}>
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
                      <Col sm={3}>
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
                      <Col sm={3}>
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
                      <Col sm={3}>
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
                      <Col sm={3}>
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
                      <Col sm={3}>
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

                {/* <ul style={{ marginLeft: "20px", fontSize: "20px" }}></ul> */}
              </Card>
              <Card bg="light" className="rounded p-4 mt-3">
                <Row>
                  {loggedUser.role === 0 && (
                    <Col>
                      <Button className="w-100 my-3" as={Link} to="/applications">
                        My Thesis Applications
                      </Button>
                    </Col>
                  )}
                  {loggedUser.role === 0 && (
                    <Col>
                      <Button className="w-100 my-3" as={Link} to="/proposals/new">
                        Add a new proposal
                      </Button>
                    </Col>
                  )}
                  {loggedUser.role === 1 && (
                    <Col>
                      <Button className="w-100 my-3" as={Link} to="/proposals">
                        Thesis proposals
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card>
              <div className="d-flex justify-content-center">
                <Button
                  className="mt-3 px-5"
                  variant="danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
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
      <footer /* className="fixed-bottom" */>
        <Col className="pr-3" xs={12} sm={2}>
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

export default HomePage;
