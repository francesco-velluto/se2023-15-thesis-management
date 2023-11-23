import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";


import { useNavigate, useParams } from "react-router-dom";
import { VirtualClockContext } from "../components/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { getProposalById } from "../api/ProposalsAPI";
import { getApplicationById } from "../api/ApplicationsAPI";


function ApplicationDetails() {

    let { application_id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoProposal, setInfoProposal] = useState({});
    const [infoStudent, setInfoStudent] = useState({});
    const [infoApplication, setInfoApplication] = useState({});

    useEffect(() => {
        const getData = async()=> {
            try {
                const application = await getApplicationById(application_id);
                setInfoApplication(application);
                console.log(application);
    
                if (application){
                    setInfoApplication(application);
                    const response = await getProposalById(application.thesis_id);
                    if(response.ok){
                        const proposal = await response.json();
                        setInfoProposal(proposal);
                    }else{
                        setErrorMessage("Error in fetching the proposal related to the application");
                    }
                }else{
                    setErrorMessage("Error in the fetching of the application.");
                }
                setIsLoading(false);
                
            } catch (error) {
                setErrorMessage(error);
                setIsLoading(false);
            }
        }

        getData();
        
    }, []);


    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Application details"} />
        </>
    )
}





export default ApplicationDetails;