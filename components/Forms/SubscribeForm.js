import { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
// import 

const SubscribeForm = () => {
	const [data, setData] = useState({
		email: ""
	});
	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		});
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!data.email) return;
		const res = await fetch('/api/subscribe', {
			body: JSON.stringify({
				email: data.email
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});

		const { error } = await res.json();

		if (error) {
			return;
		}

		setData({ email: "" });
	}
	return (
		<Form className="subscribe-form d-flex align-items-center mx-auto ms-sm-0" onSubmit={handleSubmit}>
			<Form.Control
            	name="email"
                type="email"
                value={data.email}
                placeholder="Your e-mail"
                className="bg-white border-0 text-white bg-opacity-10 rounded-0"
                aria-label="Search"
                onChange={handleChange}
            />
			<button type="submit" className="btn btn-primary-alt">I'm in</button>
		</Form>
	);
}

export default SubscribeForm;