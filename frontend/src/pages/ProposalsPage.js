import { useState } from "react";
import NavbarContainer from "../components/Navbar";
import ProposalsSearchArea from "../components/ProposalsSearchArea";
import TitleBar from "../components/TitleBar";

function ProposalsPage() {

    const [searchData, setSearchData] = useState({field: "", value: ""});

    return (
        <>
        
        <NavbarContainer/>
        <TitleBar/>
        <ProposalsSearchArea searchData={searchData} setSearchData={setSearchData} />
        
        </>
    );
}

export default ProposalsPage;
