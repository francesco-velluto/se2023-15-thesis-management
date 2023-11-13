import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";


function ProposalsList(props) {

    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);


    useEffect(() => {
        async function loadProposals(){

            const db_proposals = [{title: "Title 1", supervisor: "Giacomo Rossi", type: "type 1", expiration_date: "12/05/2023"}, {title: "Title 2", supervisor: "Giacomo Rossi", type: "type 2", expiration_date: "12/05/2023"}, {title: "Title 3", supervisor: "Giacomo Rossi", type: "type 3", expiration_date: "12/05/2023"}, {title: "Title 4", supervisor: "Giacomo Rossi", type: "type 4", expiration_date: "12/05/2023"}, ] //TODO get from API

            setProposals(db_proposals);
            setFilteredProposals(db_proposals);

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

    return <>
    
    <Row className='my-1 mx-2 border border-2 rounded border-dark bg-light' style={{cursor: 'pointer'}} onClick={() => {}} >
        <Col>
            {props.data.title}
        </Col>
        <Col>
            {props.data.supervisor}
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
