import React, { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import { initializeAuth } from "./api";
import SideBar from "./components/SideBar";

import Router from "~/router";

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (<BrowserRouter>
    <div className="flex h-screen w-full">
      <SideBar />
      <main className="flex-1 overflow-auto">
        <Router />
      </main>
    </div>
  </BrowserRouter>);
}

export default App;
