import { useContext } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { BiPlus } from "react-icons/bi";

function TitleBar() {
  const { loggedUser } = useContext(LoggedUserContext);

  return (
    <div className="row-bar">
      <Row xs={12} className="justify-content-md-center">
          <Col xs={12} md="auto" className="my-1">
            <Button type="button" id="title-btn" as={Link} to="/" className="w-100">
              Home
            </Button>
          </Col>
          <Col xs={12} md="auto" className="d-flex justify-content-center my-1" >
              <Button type="button" id="title-btn" as={Link} to="/proposals" className="w-100 mx-1">
                Proposals
              </Button>
              {loggedUser.role === 0 && (
              <Button type="button" 
                id="title-add-btn" 
                as={Link} 
                to="/proposals/new" 
                className="plus-button"
                title="Add a new proposal"
                >
                <BiPlus />
              </Button>
                )}
          </Col>
          <Col xs={12} md="auto" className="my-1">
            <Button type="button" id="title-btn" as={Link} to="/applications" className="w-100">
              Applications
            </Button>
          </Col>
        </Row>
    </div>
  );
}

export default TitleBar;
