import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getAllProposals } from "../api/ProposalsAPI";
import { useNavigate } from "react-router-dom";


function ProposalsList(props) {

    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    console.log("DB proposals: ", proposals);
    console.log("filtered: ", filteredProposals);


    useEffect(() => {
        async function loadProposals(){

            setIsLoading(true);

            try{
                const db_proposals = await getAllProposals()
            } catch(err) {
                setErrorMessage(err);
            }
            
            setIsLoading(false);
           

        }

        loadProposals();

    }, [])

    

    return (
        <>
        <Container className="bg-white rounded-bottom py-4">

        {
            filteredProposals.map((fp, index) => (
                <ProposalRow key={index} data={fp}/>
            ))
        }  

        </Container>    
        </>
    );
}


function ProposalRow(props){

    const navigate = useNavigate();

    return <>
    
    <Row className='my-1 mx-2 border border-2 rounded border-dark bg-light' style={{cursor: 'pointer'}} onClick={() => {navigate('/proposals/' + props.data.proposal_id[-1])}} >
        <Col>
            {props.data.title}
        </Col>
        <Col>
            {props.data.supervisor_surname + props.data.supervisor_name}
        </Col>
        <Col>
            {props.data.type}
        </Col>
        <Col>
            {props.data.expiration_date}
        </Col>
    </Row>
    
    </>

}

export default ProposalsList;
