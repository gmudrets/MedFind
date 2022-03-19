// import { Provider } from 'react-redux'
// import store from '../../../Redux/Store';
import Header from '../HeaderArea/Header'
import Footer from '../Footer/Footer';


function Layout() {
	return (
		// <Provider store={store}>
		// <Provider>
			<div className="Layout">
				<header>
					<Header />
				</header>
				<main>
					{/* <Routing /> */}
				</main>
				<footer>
					<Footer />
				</footer>
			</div>
		// </Provider>
	);
}

export default Layout;