import { useContext, useState } from "react";
import NavbarContainer from "../components/Navbar";
import ProposalsSearchArea from "../components/ProposalsSearchArea";
import TitleBar from "../components/TitleBar";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Alert } from "react-bootstrap";
import StudentProposalsList from "../components/StudentProposalsList";

function StudentProposalsPage() {
    const [searchData, setSearchData] = useState([]); // [{field: string, value: string}, {}]
    const { loggedUser } = useContext(LoggedUserContext);

    return (
        <>
            <NavbarContainer />
            <TitleBar />

            {
                loggedUser.role === 0 ?
                    <Alert variant="danger" className="mt-2">
                        You cannot take a look at thesis proposals
                    </Alert>
                    :
                    <>
                        <ProposalsSearchArea searchData={searchData} setSearchData={setSearchData} />
                        <StudentProposalsList searchData={searchData} />
                    </>
            }
        </>
    );
}

export default StudentProposalsPage;
