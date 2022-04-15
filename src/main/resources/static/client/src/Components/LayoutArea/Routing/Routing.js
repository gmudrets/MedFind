import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from '../../HomeArea/Home';
import Login from '../../AuthArea/Login/Login';
import Register from '../../AuthArea/Register/Register';
import Logout from '../../AuthArea/Logout/Logout';
import Settings from '../../SettingArea/Settings'
import Settings2 from '../../SettingArea/Settings2'

function Routing() {
	return (
		<div className="Routing">
			<HashRouter>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/register" element={<Register/>} />
					<Route path="/login" element={<Login/>} />
					<Route path="/logout" element={<Logout/>}/>
					<Route path="/settings" element={<Settings2/>}/>
				</Routes>
			</HashRouter>
		</div>
	);
}

export default Routing;
