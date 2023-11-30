import { useContext, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Alert, Button, Col, Row } from "react-bootstrap";
import ProfessorProposalsList from "../components/ProfessorProposalsList";
import { useNavigate } from "react-router-dom";

function ProfessorProposalsPage() {
    const { loggedUser } = useContext(LoggedUserContext);

    const navigate = useNavigate();

    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Browse Proposals"} />

            {
                loggedUser.role === 1 ?
                    <Alert variant="danger" className="mt-2">
                        You cannot take a look at thesis proposals
                    </Alert>
                    :
                    <>
                        <ProfessorProposalsList />
                    </>
            }
        </>
    );
}

export default ProfessorProposalsPage;

