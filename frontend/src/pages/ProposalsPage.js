import { useContext, useState } from "react";
import NavbarContainer from "../components/Navbar";
import ProposalsSearchArea from "../components/ProposalsSearchArea";
import TitleBar from "../components/TitleBar";
import ProposalsList from "../components/ProposalsList";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { Alert } from "react-bootstrap";

function ProposalsPage() {
    const [searchData, setSearchData] = useState([]); // [{field: string, value: string}, {}]
    const { loggedUser } = useContext(LoggedUserContext);

    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Browse Proposals"} />

            {
                Object.keys(loggedUser).includes("cod_group") ?
                    <Alert variant="danger" className="mt-2">
                        You cannot take a look at thesis proposals
                    </Alert>
                    :
                    <>
                        <ProposalsSearchArea searchData={searchData} setSearchData={setSearchData} />
                        <ProposalsList searchData={searchData} />
                    </>
            }
        </>
    );
}

export default ProposalsPage;
