import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { getAllProfessorProposals, getAllProposals } from "../api/ProposalsAPI";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, parseISO, parse } from "date-fns"
import { VirtualClockContext } from '../context/VirtualClockContext';

function ProfessorProposalsList() {

    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const { currentDate } = useContext(VirtualClockContext);
    /**
     * ! ONLY FOR DEV SIMULATIONS
     * 
     * Function to use an extra filter on the proposals list,
     * to exclude those who are expired in the current date
     * set by the virtual clock.
     * 
     * ! If the virtual clock in on:
     * !    every time you call the setProposals, you should call this
     * !    function right after that, so you apply an extra filter on the already filtered proposals.
     */
    const filterByVirtualClockDate = () => {
        setProposals((old) => {
            return old.filter((p) => p.expiration_date > currentDate);
        });
    }

    useEffect(() => {
        async function loadProposals() {
            setIsLoading(true);

            getAllProfessorProposals()
                .then(async res => {
                    if (!res.ok) {
                        setErrorMessage(res.statusText);
                        setIsLoading(false);
                        return
                    }
                    let db_proposals = (await res.json()).proposals;

                    setProposals(db_proposals);
                    filterByVirtualClockDate(); // ! REMOVE IT IN PRODUCTION
                    setIsLoading(false);
                }).catch((err) => {
                    setErrorMessage(err.message);
                    setIsLoading(false);
                })
            setIsLoading(false);
        }

        loadProposals();

    }, [currentDate])

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
                    !errorMessage && proposals.length > 0 && <>

                        <Row className='mt-1 mb-4 mx-2 p-2' >
                            <Col xs={12} md={3} className="text-center text-md-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alphabet d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                                    <path d="M2.204 11.078c.767 0 1.201-.356 1.406-.737h.059V11h1.216V7.519c0-1.314-.947-1.783-2.11-1.783C1.355 5.736.75 6.42.69 7.27h1.216c.064-.323.313-.552.84-.552.527 0 .864.249.864.771v.464H2.346C1.145 7.953.5 8.568.5 9.496c0 .977.693 1.582 1.704 1.582Zm.42-.947c-.44 0-.845-.235-.845-.718 0-.395.269-.684.84-.684h.991v.538c0 .503-.444.864-.986.864Zm5.593.937c1.216 0 1.948-.869 1.948-2.31v-.702c0-1.44-.727-2.305-1.929-2.305-.742 0-1.328.347-1.499.889h-.063V3.983h-1.29V11h1.27v-.791h.064c.21.532.776.86 1.499.86Zm-.43-1.025c-.66 0-1.113-.518-1.113-1.28V8.12c0-.825.42-1.343 1.098-1.343.684 0 1.075.518 1.075 1.416v.45c0 .888-.386 1.401-1.06 1.401Zm2.834-1.328c0 1.47.87 2.378 2.305 2.378 1.416 0 2.139-.777 2.158-1.763h-1.186c-.06.425-.313.732-.933.732-.66 0-1.05-.512-1.05-1.352v-.625c0-.81.371-1.328 1.045-1.328.635 0 .879.425.918.776h1.187c-.02-.986-.787-1.806-2.14-1.806-1.41 0-2.304.918-2.304 2.338v.65Z" />
                                </svg>
                                <strong>Title</strong>
                            </Col>
                            <Col xs={12} md={3} className="text-center text-md-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mortarboard-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
                                </svg>
                                <strong>Level</strong>
                            </Col>
                            <Col xs={12} md={2} className="text-center text-md-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                                <strong>Type</strong>
                            </Col>
                            <Col xs={12} md={2} className="text-center text-md-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-week-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                                </svg>
                                <strong>Expiration date</strong>
                            </Col>
                            <Col xs={12} md={2}>

                            </Col>
                        </Row>

                    </>
                }

                {!errorMessage && proposals.length > 0 ?
                    proposals.map((fp, index) => (
                        <ProposalRow key={index} data={fp} />
                    )) :
                    <Row>
                        <Col xs={12} className="d-flex flex-row justify-content-center">
                            You didn't create any proposal yet
                        </Col>
                        <Col xs={12} className="d-flex flex-row justify-content-center my-4">
                            <Button variant="primary" onClick={() => { navigate('/proposals/new') }}>Create a new proposal</Button>
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


function ProposalRow(props) {

    const navigate = useNavigate();

    return <>

        <Row className='my-4 mx-2 border border-2 rounded border-dark bg-light p-3 my-md-1' >
            <Col xs={12} md={3} className="text-center text-md-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alphabet d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                    <path d="M2.204 11.078c.767 0 1.201-.356 1.406-.737h.059V11h1.216V7.519c0-1.314-.947-1.783-2.11-1.783C1.355 5.736.75 6.42.69 7.27h1.216c.064-.323.313-.552.84-.552.527 0 .864.249.864.771v.464H2.346C1.145 7.953.5 8.568.5 9.496c0 .977.693 1.582 1.704 1.582Zm.42-.947c-.44 0-.845-.235-.845-.718 0-.395.269-.684.84-.684h.991v.538c0 .503-.444.864-.986.864Zm5.593.937c1.216 0 1.948-.869 1.948-2.31v-.702c0-1.44-.727-2.305-1.929-2.305-.742 0-1.328.347-1.499.889h-.063V3.983h-1.29V11h1.27v-.791h.064c.21.532.776.86 1.499.86Zm-.43-1.025c-.66 0-1.113-.518-1.113-1.28V8.12c0-.825.42-1.343 1.098-1.343.684 0 1.075.518 1.075 1.416v.45c0 .888-.386 1.401-1.06 1.401Zm2.834-1.328c0 1.47.87 2.378 2.305 2.378 1.416 0 2.139-.777 2.158-1.763h-1.186c-.06.425-.313.732-.933.732-.66 0-1.05-.512-1.05-1.352v-.625c0-.81.371-1.328 1.045-1.328.635 0 .879.425.918.776h1.187c-.02-.986-.787-1.806-2.14-1.806-1.41 0-2.304.918-2.304 2.338v.65Z" />
                </svg>
                <span className="font-weight-bold font-weight-sm-normal">{props.data.title}</span>
            </Col>
            <Col xs={12} md={3} className="text-center text-md-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mortarboard-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
                </svg>
                {props.data.level}
            </Col>
            <Col xs={12} md={2} className="text-center text-md-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
                {props.data.type}
            </Col>
            <Col xs={12} md={2} className="text-center text-md-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-week-fill d-xs-block d-md-none me-2" viewBox="0 0 16 16">
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                </svg>
                {format(parseISO(props.data.expiration_date), 'dd/MM/yyyy')}
            </Col>
            <Col xs={12} md={2} className="d-flex flex-row justify-content-center mt-3 mt-md-0" style={{ marginTop: '-2px', cursor: 'pointer', color: '#393646', fontWeight: "bold" }} onClick={() => { navigate('/proposals/' + props.data.proposal_id) }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text me-1" viewBox="0 0 16 16" style={{ marginTop: "6px" }}>
                    <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                </svg>
                Show details
            </Col>
        </Row>

    </>

}

export default ProfessorProposalsList;
