import { Provider } from 'react-redux';
import configureReduxStore from '../../../Redux/Store';
import Header from '../HeaderArea/Header'
import Routing from '../Routing/Routing';
import Footer from '../Footer/Footer';
import rootReducer from "../../../Redux/RootReducer";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

const store = configureReduxStore();


function Layout() {
	return (
		<Provider store={store}>
			<div className="Layout">
				<header>
					<Header />
				</header>
				<main>
					<Routing />
				</main>
				<footer>
					<Footer />
				</footer>
			</div>
		</Provider>
	);
}

export default Layout;