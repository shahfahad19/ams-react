import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import { AppContextProvider } from './Components/Context/AppContext';
import Footer from './Components/Main/Footer';
import Header from './Components/Main/Header';

function App() {
    return (
        <AppContextProvider>
            <div className='App h-screen'>
                <Header />
                <Outlet></Outlet>
            </div>
        </AppContextProvider>
    );
}

export default App;
