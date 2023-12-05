import { useContext, useEffect, useState } from 'react';
import { Form, Button, Col, Row, Alert, Container, Spinner } from 'react-bootstrap';
import { getAllProposals } from "../api/ProposalsAPI";
import { Typeahead } from 'react-bootstrap-typeahead';
import { VirtualClockContext } from "../context/VirtualClockContext";
import dayjs from "dayjs";
import { isSameDay, parse, parseISO } from "date-fns";
import { FaTimesCircle } from 'react-icons/fa';


const FIELDS = [
    { title: 'Title' },
    { supervisor: 'Supervisor' },
    { keywords: 'Keyword' },
    { type: 'Type' },
    { groups: 'Group' },
    { description: 'Description' },
    { required_knowledge: 'Required Knowledge' },
    { notes: 'Notes' }
];


function ProposalsSearchArea(props) {
    const { currentDate } = useContext(VirtualClockContext);

    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [typeaheadValue, setTypeaheadValue] = useState([]);
    const [searchPossibleValues, setSearchPossibleValues] = useState(null);
    const [currentPossibleValues, setCurrentPossibleValues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        getAllProposals()
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Error fetching proposals in Proposals Search Filters: ", res);
                    setErrorMessage("There was an error in loading filters for searching, please try refreshing the page");
                } else {
                    let data = (await res.json()).proposals;

                    /**
                     * DEV Enviroment - Filter the proposals suggestions applying the virtual clock date
                     */
                    data = data.filter((proposal) => {
                        const proposalExpiration = dayjs(proposal.expiration_date).format("YYYY-MM-DD");
                        return proposalExpiration >= currentDate;
                    });

                    /**
                     * Integrate the search hints with the filtered data
                     * It is duplicate of the code in ProposalsSearchArea.js
                     * which applies the filters to the full proposals data
                     */
                    for (const fltr of props.searchData) {

                        if (['title',
                            'type',
                            'description',
                            'required_knowledge',
                            'notes',
                            'level'].includes(fltr.field)) {

                            data = data.filter((elem) => ((elem[fltr.field]).toLowerCase().includes(fltr.value.toLowerCase())));

                        }

                        if (fltr.field === 'supervisor') {
                            data = data.filter((elem) => ((elem.supervisor_surname + " " + elem.supervisor_name).toLowerCase().includes(fltr.value.toLowerCase())))
                        }

                        if (['keywords', 'groups', 'degrees'].includes(fltr.field)) {
                            data = data.filter((elem) => ((elem[fltr.field]).map((s) => (s.toLowerCase())).some((str) => (str.includes(fltr.value.toLowerCase())))))
                        }

                        if (fltr.field === 'expiration_date') {
                            data = data.filter((elem) => { return isSameDay(parseISO(elem.expiration_date), parse(fltr.value, 'yyyy-MM-dd', new Date())) })
                        }
                    }

                    let possibleValuesMap = [];

                    // get all possible titles from proposals data
                    let titles = data.map((proposal) => proposal.title);

                    // remove duplicates case insensitive
                    titles = [...new Set(titles.map((title) => title.toLowerCase()))];

                    possibleValuesMap.push({ filter: "title", possible_values: titles });

                    // get all possible supervisors from proposals data
                    let supervisors = data.map((proposal) => proposal.supervisor_surname + " " + proposal.supervisor_name);

                    // remove duplicates case insensitive
                    supervisors = [...new Set(supervisors.map((supervisor) => supervisor.toLowerCase()))];

                    possibleValuesMap.push({ filter: "supervisor", possible_values: supervisors });

                    // get all possible keywords from proposals data
                    // each proposal has an array of keywords
                    let keywords = data.flatMap((proposal) => proposal.keywords);

                    // remove duplicates case insensitive
                    keywords = [...new Set(keywords.map((keyword) => keyword.toLowerCase()))];

                    possibleValuesMap.push({ filter: "keywords", possible_values: keywords });

                    // get all possible types from proposals data
                    let types = data.map((proposal) => proposal.type);

                    // remove duplicates case insensitive
                    types = [...new Set(types.map((type) => type.toLowerCase()))];

                    possibleValuesMap.push({ filter: "type", possible_values: types });

                    // get all possible groups from proposals data
                    // each proposal has an array of groups
                    let groups = data.flatMap((proposal) => proposal.groups);

                    // remove duplicates case insensitive
                    groups = [...new Set(groups.map((group) => group.toLowerCase()))];

                    possibleValuesMap.push({ filter: "groups", possible_values: groups });

                    // it is useless to do it in the description since they are very long

                    // get all possible required_knowledge from proposals data
                    // each proposal has a string of required_knowledge comma separated
                    let required_knowledge = data.flatMap((proposal) => proposal.required_knowledge.split(","));

                    // remove duplicates case insensitive
                    required_knowledge = [...new Set(required_knowledge.map((required_knowledge) => required_knowledge.toLowerCase()))];

                    possibleValuesMap.push({ filter: "required_knowledge", possible_values: required_knowledge });

                    // it is useless to do it in the notes since they are very long

                    // get all possible levels from proposals data
                    let levels = data.map((proposal) => proposal.level);

                    // remove duplicates case insensitive
                    levels = [...new Set(levels.map((level) => level.toLowerCase()))];

                    possibleValuesMap.push({ filter: "level", possible_values: levels });

                    // get all possible degrees from proposals data
                    // each proposal has an array of degrees
                    let degrees = data.flatMap((proposal) => proposal.degrees);

                    // remove duplicates case insensitive
                    degrees = [...new Set(degrees.map((degree) => degree.toLowerCase()))];

                    possibleValuesMap.push({ filter: "degrees", possible_values: degrees });

                    // post-processing to remove whitespaces and cleaning data
                    possibleValuesMap.forEach((e, i) => {
                        let dirtyPossibleValues = e.possible_values;

                        // trim whitespaces
                        let cleanPossibleValues = dirtyPossibleValues.map((possibleValue) => possibleValue.trim());

                        // make first letter uppercase
                        cleanPossibleValues = cleanPossibleValues.map((possibleValue) => possibleValue.charAt(0).toUpperCase() + possibleValue.slice(1));

                        e.possible_values = cleanPossibleValues;
                        possibleValuesMap[i] = e;
                    })

                    setSearchPossibleValues(possibleValuesMap);
                }

                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching proposals in Proposals Search Filters: ", err);
                setErrorMessage("There was an error in loading filters for searching, please try refreshing the page");
                setIsLoading(false);
            });

    }, [props.searchData.length, currentDate]);

    useEffect(() => {
        setSearchValue("");

        // get the possible values for the selected field
        if (searchField !== "" && searchField !== "description" && searchField !== "notes") {
            let possibleValuesObject = searchPossibleValues.filter((possibleValue) => possibleValue.filter === searchField);
            setCurrentPossibleValues(possibleValuesObject[0].possible_values);
        }
    }, [searchField])

    const handleSubmit = (event) => {
        event.preventDefault();

        if (searchField === "" || (searchValue === "" && typeaheadValue.length === 0)) {
            setError(true);
            return
        }

        let value = searchValue;
        if (searchField !== "description" && searchField !== "notes") {
            // check if typeaheadValue[0] is not a string
            // this means user entered a new value not in the hints
            if (typeof typeaheadValue[0] === 'string' || typeaheadValue[0] instanceof String) {
                value = typeaheadValue[0];
            } else {
                value = typeaheadValue[0].label;
            }
        }

        props.setSearchData((sd) => {
            const result = [...sd, { field: searchField, value: value }]
            return result;
        });

        setSearchField("");
        setSearchValue("");
        setTypeaheadValue([]);
        setError(false);
    }

    return (
        (isLoading ?
            (<Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Spinner animation="border">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                </Row>
            </Container>)
            :
            errorMessage ?
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Alert variant="danger">
                                {errorMessage}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
                :
                searchPossibleValues &&
                    <div className="container-fluid bg-light p-3 d-flex flex-column align-items-center">
                        {error &&
                            <Alert variant={"danger"}>
                                Wrong filtering parameters! Retry!
                            </Alert>
                        }

                        <Form onSubmit={handleSubmit} className="mb-3" style={{ width: "50vw" }} validated={false}>
                            <Row className="align-items-end">
                                <Col xs={12} md={2}>
                                    <div className='m-2'>Filter by:</div>
                                </Col>
                                <Col xs={12} md={4} className="mb-2 mb-md-0">
                                    <Form.Select
                                        aria-label="Default select example"
                                        value={searchField}
                                        onChange={(event) => {
                                            setSearchField((sd) => (event.target.value));
                                            setError(false)
                                        }}
                                        style={{ maxWidth: "100%" }}>
                                        <option value="" disabled={true}>Field</option>
                                        {
                                            FIELDS.flatMap(obj => Object.entries(obj)).filter(([key]) => !props.searchData.find(el => el.field === key)).map(([key, value], index) => (
                                                <option key={index} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                </Col>
                                <Col xs={12} md={4} className="mb-2 mb-md-0">
                                    {
                                        (searchField === "" || searchField === "description" || searchField === "notes") ?
                                            <Form.Control
                                                type="text"
                                                id="inputValue"
                                                aria-describedby="insert-value-form"
                                                placeholder="Value"
                                                value={searchValue}
                                                onChange={(event) => {
                                                    setSearchValue(event.target.value);
                                                    setError(false)
                                                }}
                                                style={{ maxWidth: "100%" }}
                                                disabled={searchField === ""}
                                            />
                                            :
                                            <Typeahead
                                                options={currentPossibleValues}
                                                allowNew={true}
                                                newSelectionPrefix={"Includes: "}
                                                id="inputValue"
                                                aria-describedby="insert-value-form"
                                                placeholder="Value"
                                                value={typeaheadValue}
                                                onChange={(selected) => {
                                                    setTypeaheadValue((sd) => (selected));
                                                    setError(false)
                                                }}
                                                style={{ maxWidth: "100%" }}
                                                selected={typeaheadValue}
                                            >
                                            </Typeahead>
                                    }

                                </Col>
                                <Col xs={12} md={2} className='d-flex flex-row justify-content-center'>
                                    <Button type="submit" variant="outline-secondary" onClick={handleSubmit}
                                        style={{ maxWidth: "100%" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor"
                                            className="bi bi-search" viewBox="0 0 16 16">
                                            <path
                                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                        </svg>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        <Row className='w-100 d-flex flex-row justify-content-center'>
                            {
                                props.searchData.map((fltr, index) => (
                                    <FilterElement key={index} fltr={fltr} setSearchData={props.setSearchData} />
                                ))
                            }
                        </Row>

                    </div>
        )
    );
}

function FilterElement(props) {

    const [userfriendly_field, setUserfriendly_field] = useState("");

    useEffect(() => {
        for (const elem of FIELDS) {
            const key = Object.keys(elem)[0];

            if (key === props.fltr.field) {
                setUserfriendly_field(elem[key]);
                break;
            }
        }
    }, [])


    return (
        <Col xs lg="3">
            <div className='mx-3 my-1 p-1 border border-2 border-dark rounded d-flex align-items-center justify-content-between'>
                <span className='filterCardContainer'>
                    <strong>{userfriendly_field}</strong>: {props.fltr.value}
                </span>

                <FaTimesCircle
                    style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                    onClick={() => {
                        props.setSearchData((sd) => sd.filter((elem) => elem.field !== props.fltr.field));
                    }}
                />
            </div>

        </Col>
    );
}


export default ProposalsSearchArea;
