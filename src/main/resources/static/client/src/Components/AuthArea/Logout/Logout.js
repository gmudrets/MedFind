import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from "../../../Redux/Auth";
import { useNavigate } from "react-router-dom";

function Logout() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(Actions.logUserOut);
		console.log('You are logged out!');
		navigate("/login");
	}, []);
	return null;
}

export default Logout;
