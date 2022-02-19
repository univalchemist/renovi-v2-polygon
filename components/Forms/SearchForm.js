import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Router from 'next/router';

const SearchForm = () => {
	const [data, setData] = useState({
		searchkey: ""
	});
	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		Router.push(`/search-results?s=${data.searchkey}`);
	}
	return (
		<Form className="d-none d-sm-flex" onSubmit={handleSubmit}>
            <Form.Control
            	name="searchkey"
                type="search"
                value={data.searchkey}
                placeholder="Search by item or creator"
                className="bg-white border-0 text-white bg-opacity-10 rounded-0"
                aria-label="Search"
                onChange={handleChange}
            />
            <button className="btn btn-primary-alt px-4 d-none" type="button"><i className="fas fa-search"></i></button>
        </Form>
	)

}

export default SearchForm;