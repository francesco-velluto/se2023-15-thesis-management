import { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const FIELDS = [    'Title',
                    'Supervisor',
                    'Keyword',
                    'Type',
                    'Group',
                    'Description',
                    'Required Knowledge',
                    'Notes',
                    'Expiration Date',
                    'Level',
                    'CDS / Programme'];


function ProposalsSearchArea(props) {

    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if(searchField === "" || !searchValue){
            return;
        }

        props.setSearchData((sd) => {
            sd.push({field: searchField, value: searchValue});
            return sd;
        });

        setSearchField("");
        setSearchValue("");

        //TODO: aggiornamento lista proposals
        
    }

    return (
        <>
        
        <div className=".container-fluid bg-light p-3 d-flex flex-column align-items-center" >
                
            <Form onSubmit={handleSubmit} className="w-50 d-flex flex-row justify-content-between">
                <div className='m-2'>Filter by:</div>
                <Form.Select aria-label="Default select example" value={searchField} onChange={(event) => {setSearchField((sd) => (event.target.value))}} className='m-2' style={{maxWidth: "25%"}}>
                    <option value="">Field</option>
                    {
                        FIELDS.filter((f) => (!props.searchData.find((el) => (el.field === f)))).map((f) => 
                            <option value={f} >{f}</option>
                        )
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
                    </svg>
                </Button>
                
            </Form>
                 
            
            <div className="d-flex flex-row">
                {
                    props.searchData.map((fltr) => {
                        <FilterElement fltr={fltr} setSearchData={props.setSearchData}/>
                    })
                }
            </div>
        </div>

        </>
    );
}

function FilterElement(props){
    return <>
    <Container className='d-flex flex-row'>
        Field: 
        {props.fltr.field}
        Value: 
        {props.fltr.value}
    </Container>
    </>
}

export default ProposalsSearchArea;
