import React, { useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import SideBar from './components/SideBar';
import Router from "~/router";
import { initializeAuth } from './api';

function App() {
  useEffect(() => {
    initializeAuth().catch(console.error);
  }, []);

  return <Router />;
}

export default App;
