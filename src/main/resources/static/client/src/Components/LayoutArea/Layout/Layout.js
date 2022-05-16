import { Provider } from 'react-redux';
import configureReduxStore from '../../../Redux/Store';
import Header from '../HeaderArea/Header'
import Routing from '../Routing/Routing';
import Footer from '../Footer/Footer';
import {PersistGate} from 'redux-persist/integration/react'
import './Layout.css';

const {store, persistor} = configureReduxStore();


function Layout() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
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
			</PersistGate>
		</Provider>
	);
}

export default Layout;
