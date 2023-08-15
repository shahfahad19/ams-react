import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppContextProvider } from './Components/Context/AppContext';
import Header from './Components/Main/Header';

function App() {
  return (
    <AppContextProvider>
      <div className="h-screen overflow-y-scroll">
        <Header />
        <Outlet></Outlet>
      </div>
    </AppContextProvider>
  );
}

export default App;
