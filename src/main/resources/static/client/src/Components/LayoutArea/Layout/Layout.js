import {Provider} from 'react-redux';
import configureReduxStore from '../../../Redux/Store';
import Header from '../HeaderArea/Header'
import Routing from '../Routing/Routing';
import Footer from '../Footer/Footer';
import {HashRouter} from "react-router-dom";

const store = configureReduxStore();

function Layout() {
    return (

        <Provider store={store}>
            <div className="Layout">
                <HashRouter>
                    <header>
                        <Header/>
                    </header>
                    <main>
                        <Routing/>
                    </main>
                    <footer>
                        <Footer/>
                    </footer>
                </HashRouter>
            </div>
        </Provider>
    );
}

export default Layout;