import { useEffect, useState } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';

const FIELDS = [{title: 'Title'},
                {supervisor: 'Supervisor'},
                {keywords:    'Keyword'},
                {type:     'Type'},
                {groups:     'Group'},
                {description:    'Description'},
                {required_knowledge:    'Required Knowledge'},
                {notes:    'Notes'},
                {expiration_date:    'Expiration Date'},
                {level:    'Level'},
                {degrees:    'CDS / Programme'}];


function ProposalsSearchArea(props) {

    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if(searchField === "" || !searchValue){
            return;
        }

        props.setSearchData((sd) => {
            const result = [...sd, {field: searchField, value: searchValue}]
            return result;
        });

        setSearchField("");
        setSearchValue("");
        
    }

    return (
        <Container>
            <Row style={{backgroundColor: "white"}}>
                <Col>
                    <Form onSubmit={handleSubmit} className="mb-3 d-flex justify-content-center">
                        <span style={{margin: "auto 3px"}}>Filter by:</span>
                        <Form.Select aria-label="Default select example" value={searchField} onChange={(event) => {setSearchField((sd) => (event.target.value))}} className='m-2' style={{maxWidth: "25%"}}>
                            <option value="">Field</option>
                            {
                                FIELDS.flatMap(obj => Object.entries(obj)).filter((key) => !props.searchData.find(el => el.field === key)).map(([key, value], index) => (
                                    <option key={index} value={key}>
                                        {value}
                                    </option>
                                ))

                            }
                        </Form.Select>

                        <Form.Control
                            type="text"
                            id="inputValue"
                            aria-describedby="insert-value-form"
                            placeholder="Value"
                            value={searchValue}
                            onChange={(event) => {setSearchValue((sd) => (event.target.value))}}
                            className='m-2'
                            style={{maxWidth: "25%"}}
                        />

                        <Button type="submit" variant="outline-secondary" className='m-2' onClick={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg> Search
                        </Button>

                    </Form>
                </Col>
            </Row>
            <Row style={{backgroundColor: "white"}}>
                <Col>
                    <Row className='d-flex flex-row justify-content-center'>
                        {
                            props.searchData.map((fltr, index) => (
                                <FilterElement key={index} fltr={fltr} setSearchData={props.setSearchData}/>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
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
      <>
        <Col xs lg="3">
          <Container className='mx-3 my-1 border border-2 border-dark rounded position-relative'>
            <strong>{userfriendly_field}</strong> : {((props.fltr.value + "").length < 11 ? props.fltr.value : (props.fltr.value.slice(0, 10) + "..."))}
    
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-circle position-absolute top-0 end-0"
              style={{ margin: '4px', cursor: 'pointer' }}
              viewBox="0 0 16 16"
              onClick={() => {
                props.setSearchData((sd) => {
                    return sd.filter((elem) => (elem.field !== props.fltr.field))
                })
              }}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </Container>
        </Col>
      </>
    );
  }
  

export default ProposalsSearchArea;
