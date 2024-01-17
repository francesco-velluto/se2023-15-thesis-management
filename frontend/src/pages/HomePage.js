import { useContext, useEffect, useState } from "react";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import {
  getAllApplicationsByTeacher,
  getAllApplicationsByStudent,
} from "../api/ApplicationsAPI";
import dayjs from "dayjs";

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
                        .sort((a, b) => {
                          return b.application_date < a.application_date
                            ? -1
                            : 1;
                        })
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
                      <Row className="d-flex justify-content-center">
                        <Button
                          variant="outline-secondary"
                          className="mt-2"
                          onClick={() => navigate("/applications")}
                          style={{ maxWidth: "300px" }}
                        >
                          All applications
                        </Button>
                      </Row>
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
                      <Row className="d-flex justify-content-center">
                        <Button
                          variant="outline-secondary"
                          className="mt-2"
                          onClick={() => navigate("/proposals")}
                          style={{ maxWidth: "300px" }}
                        >
                          Browse proposals
                        </Button>
                      </Row>
                    </>
                  ) : (
                    <>
                      <h3>Your last application</h3>
                      <Col lg={12}>
                        <Card
                          className="my-3"
                          text={"light"}
                          id={"student-application-card"}
                          bg={
                            applications[0].status === "Accepted"
                              ? "success"
                              : applications[0].status === "Rejected"
                              ? "danger"
                              : applications[0].status === "Pending"
                              ? "secondary"
                              : "dark"
                          }
                        >
                          <Card.Header id="student-application-card-header">
                            {applications[0].status === "Accepted" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : applications[0].status === "Canceled" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            ) : applications[0].status === "Pending" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line
                                  x1="4.93"
                                  y1="4.93"
                                  x2="19.07"
                                  y2="19.07"
                                ></line>
                              </svg>
                            )}{" "}
                            <b>{applications[0].status}</b>
                          </Card.Header>
                          <Card.Body
                            className={"student-application-card-body"}
                          >
                            <Card.Title id="student-application-card-title">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                              </svg>{" "}
                              {applications[0].title}
                            </Card.Title>
                            <Card.Subtitle>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>{" "}
                              {applications[0].supervisor_surname}{" "}
                              {applications[0].supervisor_name}
                            </Card.Subtitle>
                            <Card.Text>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>{" "}
                              You applied on{" "}
                              <i>
                                {dayjs(applications[0].application_date).format(
                                  "dddd, DD MMMM YYYY"
                                )}
                              </i>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Row className="d-flex justify-content-center">
                        <Button
                          variant="outline-secondary"
                          className="mt-2"
                          onClick={() => navigate("/applications")}
                          style={{ maxWidth: "300px" }}
                        >
                          All applications
                        </Button>
                      </Row>
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
