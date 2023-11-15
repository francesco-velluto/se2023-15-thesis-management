import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { getAllProposals } from "../api/ProposalsAPI";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, parseISO, parse } from "date-fns"


function ProposalsList(props) {

    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        async function loadProposals(){

            setIsLoading(true);

            getAllProposals().then(async res => {
                if(!res.ok){
                    setErrorMessage(res.statusText);
                    setIsLoading(false);
                    return
                }
                let db_proposals = (await res.json()).proposals;

                
                setProposals(db_proposals);
                setFilteredProposals(db_proposals);
                setIsLoading(false);
            }).catch((err) => {
                setErrorMessage(err.message);
                setIsLoading(false);
            })

            
            setIsLoading(false);
           

        }

        loadProposals();

    }, [])


    useEffect(() => {

        setFilteredProposals(() => {
            let result = [...proposals];
            for(const fltr of props.searchData){

                if(['title',
                'type',
                'description',
                'required_knowledge',
                'notes',
                'level'].includes(fltr.field)){
                    
                    result = result.filter((elem) => ((elem[fltr.field]).toLowerCase().includes(fltr.value.toLowerCase())));
                   
                }

                if(fltr.field === 'supervisor'){
                    result = result.filter((elem) => ((elem.supervisor_surname + " " + elem.supervisor_name).toLowerCase().includes(fltr.value.toLowerCase())))
                }

                if(['keywords', 'groups', 'degrees'].includes(fltr.field)){
                    console.log(result);
                    result = result.filter((elem) => ((elem[fltr.field]).map((s) => (s.toLowerCase())).some((str) => (str.includes(fltr.value.toLowerCase())))))
                }

                if(fltr.field === 'expiration_date'){
                    result = result.filter((elem) => {return isSameDay(parseISO(elem.expiration_date), parse(fltr.value, 'yyyy-MM-dd', new Date()))})

                }

                
            }
            return result;
        })

    }, [props.searchData.length])
    

    return (
        <>
        <Container className="bg-white rounded-bottom py-4">
        {
            isLoading && 
            <Row>
                <Col>
                    <Alert variant="danger">Loading...</Alert>
                </Col>
            </Row>
        }
        {
            !errorMessage && filteredProposals.length > 0 && <>
            
            <Row className='mt-1 mb-4 mx-2 p-2' >
                <Col xs={12} md={3} className="text-center text-md-start">
                    <strong>Title</strong>
                </Col>
                <Col xs={12} md={3} className="text-center text-md-start">
                    <strong>Supervisor</strong>
                </Col>
                <Col xs={12} md={2} className="text-center text-md-start">
                    <strong>Type</strong>
                </Col>
                <Col xs={12} md={2} className="text-center text-md-start">
                    <strong>Expiration date</strong>
                </Col>
                <Col xs={12} md={2}>
                    
                </Col>
            </Row>
            
            </>
        }

        {   !errorMessage && filteredProposals.length > 0 ? 
            filteredProposals.map((fp, index) => (
                <ProposalRow key={index} data={fp}/>
            )) : 
            <Row>
                <Col className="d-flex flex-row justify-content-center">
                    There are no available thesis proposals
                </Col>
            </Row>
        }  
        {
            errorMessage && 
            <Row>
                <Col>
                    <Alert variant="danger">{errorMessage}</Alert>
                </Col>
            </Row>
        }

        </Container>    
        </>
    );
}


function ProposalRow(props){

    const navigate = useNavigate();

    return <>
    
    <Row className='my-1 mx-2 border border-2 rounded border-dark bg-light p-2' >
        <Col xs={12} md={3} className="text-center text-md-start">
            {props.data.title}
        </Col>
        <Col xs={12} md={3} className="text-center text-md-start">
            {props.data.supervisor_surname + " " + props.data.supervisor_name}
        </Col>
        <Col xs={12} md={2} className="text-center text-md-start">
            {props.data.type}
        </Col>
        <Col xs={12} md={2} className="text-center text-md-start">
            {format(parseISO(props.data.expiration_date), 'dd/MM/yyyy')}
        </Col>
        <Col xs={12} md={2} className="d-flex flex-row justify-content-center mt-3 mt-md-0" style={{ marginTop: '-2px', cursor:'pointer' }} onClick={() => {navigate('/proposals/' + props.data.proposal_id)}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text me-1" viewBox="0 0 16 16" style={{marginTop: "6px"}}>
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            </svg>
            Show details
        </Col>
    </Row>
    
    </>

}

export default ProposalsList;
