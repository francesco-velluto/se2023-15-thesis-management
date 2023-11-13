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
                    
                    result = result.filter((elem) => (elem[fltr.field].includes(fltr.value)));
                   
                }

                if(fltr.field === 'supervisor'){
                    result = result.filter((elem) => ((elem.supervisor_surname + " " + elem.supervisor_name).includes(fltr.value)))
                }

                if(['keywords', 'groups', 'degrees'].includes(fltr.field)){
                    console.log(result);
                    result = result.filter((elem) => (elem[fltr.field].some((str) => (str.includes(fltr.value)))))
                }

                if(fltr.field === 'expiration_date'){

                    

                    result = result.filter((elem) => {console.log(elem.expiration_date, parse(fltr.value, 'dd/MM/yyyy', new Date())); return isSameDay(parseISO(elem.expiration_date), parse(fltr.value, 'dd/MM/yyyy', new Date()))})

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

        {   !errorMessage && 
            filteredProposals.map((fp, index) => (
                <ProposalRow key={index} data={fp}/>
            ))
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
    
    <Row className='my-1 mx-2 border border-2 rounded border-dark bg-light' style={{cursor: 'pointer'}} onClick={() => {navigate('/proposals/' + props.data.proposal_id[-1])}} >
        <Col>
            {props.data.title}
        </Col>
        <Col>
            {props.data.supervisor_surname + " " + props.data.supervisor_name}
        </Col>
        <Col>
            {props.data.type}
        </Col>
        <Col>
            {format(parseISO(props.data.expiration_date), 'dd/MM/yyyy')}
        </Col>
    </Row>
    
    </>

}

export default ProposalsList;
