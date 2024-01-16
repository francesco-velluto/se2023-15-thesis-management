import Logo from '../images/logo_poli_bianco_260.png'
import {Card, Col, Container, Row, Spinner} from "react-bootstrap";
import React from "react";

function GenericLoading({text}) {
  const displayText = text ? text : "Loading";

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh'}}>
      <Card className={"text-center align-items-center justify-content-center bg-transparent border-0"} style={{minWidth: '350px'}}>
        <Card.Header className={"w-100 generic-loading-header rounded-pill"}>
          <img src={Logo} alt="Logo" width="60" height="auto" className="bi bi-mortarboard-fill me-2"/>
          <br/>
          <span id="navbar-title">THESIS MANAGEMENT</span>
        </Card.Header>
        <Card.Body className={"bg-light rounded-5 w-100"}>
          <Spinner animation="grow" className={"generic-loading-spinner"}/>
          <Card.Text>
            {displayText}
            <br/>
            Please wait...
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default GenericLoading;