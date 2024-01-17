import { useContext, useEffect, useState } from "react";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Button, Card, Col, Container, Badge, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import {
  getAllApplicationsByTeacher,
  getAllApplicationsByStudent,
} from "../api/ApplicationsAPI";

function HomePage() {
  const { loggedUser } = useContext(LoggedUserContext);

  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    if (loggedUser.role === 0) {
      const res = await getAllApplicationsByTeacher(loggedUser.id);
      const flatApplications = [];
      res.forEach((p) => {
        p.applications.forEach((a) =>
          flatApplications.push({
            ...a,
            proposal: { proposal_id: p.proposal_id, title: p.title },
          })
        );
      });
      setApplications(flatApplications);
    } else {
      const res = await getAllApplicationsByStudent(loggedUser.id);
      res?.sort((a, b) => {
        return b.application_date < a.application_date ? -1 : 1;
      });
      setApplications(res);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [loggedUser]);

  const formattedDate = (date) => {
    return format(new Date(date), "MMMM do yyyy");
  };

  return (
    <>
      <NavbarContainer />
      <TitleBar />
      <Container fluid className="home-page">
        <Row className="home-page-content p-3">
          {loggedUser && (
            <Card bg="light" className="rounded p-4">
              <Row className="my-3">
                <h2>
                  <b>Welcome back, {loggedUser.name}!</b>
                </h2>
              </Row>

              {loggedUser.role === 0 && (
                <Row>
                  <h3>Recent pending applications</h3>
                  {applications.filter((a) => a.status === "Pending").length ===
                  0 ? (
                    <p>You don't have any pending application at the moment.</p>
                  ) : (
                    <>
                      {applications
                        .filter((a) => a.status === "Pending")
                        .slice(0, 3)
                        .map((a) => (
                          <Card key={a.application_id} className="my-1">
                            <Card.Body>
                              <Row className="align-items-center">
                                <Col xs={12} sm={6}>
                                  <Row>
                                    <h5>
                                      <b>{a.proposal.title}</b>
                                    </h5>
                                  </Row>
                                  <Row>
                                    <b>
                                      {a.name} {a.surname}
                                    </b>
                                  </Row>{" "}
                                  applied on {formattedDate(a.application_date)}
                                </Col>
                                <Col
                                  xs={12}
                                  sm={6}
                                  className="text-end mt-2 mt-sm-3 mt-sm-0 d-flex justify-content-center align-items-start d-sm-block"
                                >
                                  <Button
                                    variant="outline-secondary"
                                    className="text-end show-details-btn"
                                    onClick={() =>
                                      navigate(
                                        `/applications/${a.application_id}`
                                      )
                                    }
                                  >
                                    Show details
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => navigate("/applications")}
                      >
                        All applications
                      </Button>
                    </>
                  )}
                </Row>
              )}

              {loggedUser.role === 1 && (
                <Row>
                  {applications.length === 0 ? (
                    <>
                      <h3>Looking for a thesis?</h3>
                      <p className="my-2">
                        You didn't apply for any thesis proposal yet. You can
                        start browsing the available proposals for you!
                      </p>
                      <Button
                        variant="outline-secondary"
                        className="mt-2"
                        onClick={() => navigate("/proposals")}
                      >
                        Browse proposals
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3>Your last application</h3>
                      <Card className="my-3">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Row>
                              <h5>
                                <b>{applications[0].title}</b>
                              </h5>
                            </Row>
                            <Row>
                              <p>
                                {applications[0].supervisor_name}{" "}
                                {applications[0].supervisor_surname}{" "}
                              </p>
                            </Row>
                            <Row className="mb-1">
                              <p>
                                You applied on{" "}
                                {formattedDate(
                                  applications[0].application_date
                                )}
                              </p>
                            </Row>
                            <Row className="d-flex min-width-fit-content ms-1">
                              <Badge
                                pill
                                bg={
                                  applications[0].status === "Pending"
                                    ? "warning"
                                    : applications[0].status === "Accepted"
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {applications[0].status}
                              </Badge>
                            </Row>
                          </Row>
                        </Card.Body>
                      </Card>
                      <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => navigate("/applications")}
                      >
                        All applications
                      </Button>
                    </>
                  )}
                </Row>
              )}
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

export default HomePage;
