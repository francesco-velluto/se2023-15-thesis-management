import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';


function ProposalsSearchArea(props) {

    const [searchFields, setSearchFields] = useState([]);
    const [usedFilters, setUsedFilters] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
    }

    return (
        <>
        
        <div className=".container-fluid bg-light p-3 d-flex flex-column align-items-center" >
                
            <Form onSubmit={handleSubmit} className="w-50 d-flex flex-row justify-content-between">
                <div className='m-2'>Filter by:</div>
                <Form.Select aria-label="Default select example" value={props.searchData.field} onChange={(event) => {props.setSearchData((sd) => ({...sd, field: event.target.value}))}} className='m-2' style={{maxWidth: "25%"}}>
                    <option value="">Field</option>
                    {
                        searchFields.filter((f) => (!usedFilters.includes(f) || f.data_type === "ARRAY")).map((f) => {
                            return <option value={f.column_name}>{
                                
                            }</option>
                        })
                    }
                </Form.Select>

                <Form.Control
                    type="text"
                    id="inputValue"
                    aria-describedby="insert-value-form"
                    placeholder="Value"
                    value={props.searchData.value}
                    onChange={(event) => {props.setSearchData((sd) => ({...sd, value: event.target.value}))}}
                    className='m-2'
                    style={{maxWidth: "25%"}}
                />

                <Button type="submit" variant="outline-secondary" className='m-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </Button>
                
            </Form>
                 
            
            <div className="d-flex flex-row">
                zyzyzyzz
            </div>
        </div>

        </>
    );
}

export default ProposalsSearchArea;
