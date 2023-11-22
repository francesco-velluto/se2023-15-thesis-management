import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";


import { useNavigate, useParams } from "react-router-dom";
import { VirtualClockContext } from "../components/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { getProposalById } from "../api/ProposalsAPI";
//import { getApplicationById } from "../../../backend/service/applications.service";


function ApplicationDetails() {

    let { application_id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoProposal, setInfoProposal] = useState({});
    const [infoStudent, setInfoStudent] = useState({});
    const [infoApplication, setInfoApplication] = useState({});

    useEffect(async () => {
        try {
            const application = await getApplicationById(application_id);
            setInfoApplication(application);

            const proposal = await getProposalById(application.proposal_id);
            setInfoProposal(proposal);
        } catch (error) {
            setErrorMessage(error);
            setIsLoading(false);
        }
    }, [])


    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Application details"} />
        </>
    )
}





export default ApplicationDetails;