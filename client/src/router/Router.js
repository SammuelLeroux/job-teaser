import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Connexion from '../pages/Connexion';
import Home from '../pages/Home';
import Admin from '../pages/Admin';
import MesAnnonces from '../pages/MesAnnonces';
import Postuler from '../pages/Postuler';
import Manager from '../pages/Manager';

const Routing = () => {

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<Connexion />} />
                <Route path='/home' element={<Home />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='/mes-annonces' element={<MesAnnonces />} />
                <Route path='/postuler' element={<Postuler />} />
                <Route path='/manager' element={<Manager />} />
            </Routes>
        </Router>
    );
};

export default Routing;