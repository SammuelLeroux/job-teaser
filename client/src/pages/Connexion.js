import React, { useEffect } from "react";

import { useNavigate } from 'react-router-dom';

import { Container } from "react-bootstrap";

// style
import './styles/Connexion.css';

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Connexion = () => {

    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    let isConnected = false;
    if (user != null) isConnected = true;

    // redirection
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected)
        {
            if (user.droit === 1) navigate('/admin');
            else navigate('/home');
    
            window.location.reload();
        }
    }, [navigate, isConnected, user]);

    return (
        <div id="container">
            <Header />
            <div className="runningBox">
                <Container>
                    <h4>
                    {
                        isConnected ? 'Nothing to see there' : 'Veuillez vous connecter pour accéder au site.'
                    }
                    </h4>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Connexion;