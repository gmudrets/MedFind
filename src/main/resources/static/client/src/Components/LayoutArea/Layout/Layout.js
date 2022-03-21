import { Provider } from 'react-redux';
import configureReduxStore from '../../../Redux/Store';
import Header from '../HeaderArea/Header'
import Routing from '../Routing/Routing';
import Footer from '../Footer/Footer';

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