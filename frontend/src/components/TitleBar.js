import { useContext } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { BiPlus } from "react-icons/bi";
import { FaCog, FaFileAlt, FaHome, FaMobile, FaMobileAlt, FaPen } from "react-icons/fa";

function TitleBar({ }) {
  const { loggedUser } = useContext(LoggedUserContext);

  return (
    <div className="row-bar">
      <Row xs={12} className="justify-content-md-center">
        <Col xs={12} md="auto" className="my-1">
          <Button type="button" id="title-btn" as={Link} to="/" className="title-bar-btn w-100">
            <span className="d-flex align-items-center">
              <FaHome className="me-1" />
              Home
            </span>
          </Button>
        </Col>
        {loggedUser?.role === 1 &&
          <Col xs={12} md="auto" className="my-1">
            <Button type="button" id="add-thesis-request-btn" as={Link} to="/proposals/requests/new" className="title-bar-btn w-100">
              <span className="d-flex align-items-center">
                <FaPen className="me-1" />
                Thesis Request
              </span>
            </Button>
          </Col>
        }
        <Col xs={12} md="auto" className="d-flex justify-content-center my-1" >
          <Button type="button" id="title-btn" as={Link} to="/proposals" className="title-bar-btn w-100 mx-1">
            <span className="d-flex align-items-center">
              <FaFileAlt className="me-1" />
              Proposals
            </span>
          </Button>
          {loggedUser.role === 0 && (
            <Button type="button"
              id="title-add-btn"
              as={Link}
              to="/proposals/new"
              className="title-bar-add-btn plus-button"
              title="Add a new proposal"
            >
              <BiPlus />
            </Button>
          )}
        </Col>
        <Col xs={12} md="auto" className="my-1">
          <Button type="button" id="title-btn" as={Link} to="/applications" className="title-bar-btn w-100">
            <span className="d-flex align-items-center">
              <FaCog className="me-1" />
              Applications
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default TitleBar;
