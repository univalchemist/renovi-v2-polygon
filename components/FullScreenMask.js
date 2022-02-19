import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
const FullScreenMask = () => {
	const processing = useSelector(state => state.processing);
	return (
		<div className={`fullscreen-mask-wrapper ${processing?"show":""}`}>
			<Spinner animation="border" variant="light" />
		</div>
	);
}

export default FullScreenMask;