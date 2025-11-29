import { useState } from 'react'
import {BrowserRouter, Routes, Route } from "react-router-dom";
import HomeController from "./controllers/HomeController.jsx";


function App() {

    return (
        <BrowserRouter>
            <Routes>
	        <Route path="/" element={<HomeController/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
