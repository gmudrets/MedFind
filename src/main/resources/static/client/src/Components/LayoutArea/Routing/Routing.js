import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../../HomeArea/Home';
import Login from '../../AuthArea/Login/Login';
import Register from '../../AuthArea/Register/Register';
import Logout from '../../AuthArea/Logout/Logout';
// import PageNotFound from '../PageNotFound/PageNotFound';
// import Loadable from 'react-loadable';
// import Loading from '../../SharedArea/Loading/Loading';
// import ContactUs from '../../AboutArea/ContactUs/ContactUs';

function Routing() {
	return (
		<div className="Routing">
			<Router>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/register" element={<Register/>} />
					<Route path="/login" element={<Login/>} />
					<Route path="/logout" element={<Logout/>} />
				</Routes>
			</Router>
		</div>
	);
}

export default Routing;
