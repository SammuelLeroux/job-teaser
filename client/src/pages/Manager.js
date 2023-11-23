import React, { useState, useEffect } from 'react';

// react-router-dom
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// API
// import axios from 'axios';

// style
import './styles/Manager.css';

// boostrap
import { Container, Button } from 'react-bootstrap';

// composants
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ManageItem from '../components/ManageItem/ManageItem';
import Validation from '../components/Validation/Validation';

const Manager = () => {

    // information utilisateur en cours
    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    let isConnected = false;
    if (user != null) isConnected = true;

    const navigate = useNavigate();

    // on recupere les informations de l'item envoyé
    const location = useLocation();

    useEffect(() => {
      if (isConnected === false)
      {
        navigate('/');
      }
      else
      {
        if (location.state === null)
        {
          if (user.droit === 1) navigate('/admin');
          else navigate('/home');
        }
      }
    }, [navigate, isConnected, user, location]);

  // pour le bouton retour
  const handleBack = () => {
    navigate(-1);
  };

  const [ showValidation, setShowValidation ] = useState(false);
  const [ actionValidation, setActionValidation ] = useState('');
  const onValidationReceived = (validation, action) => {
    if (validation)
    {
      setShowValidation(true);
      setActionValidation(action);
    }
  };

  return (
    <div id="container">
      {
        isConnected ?
        <Validation
          showValidation={showValidation}
          action={actionValidation}
        />
        : null
      }
        <Header />
        <div className="runningBox">
            <Container className='d-flex flex-column align-items-center mb-5'>
              {
                location.state !== null ? (
                  <ManageItem
                    action={location.state !== null ? location.state.action : null}
                    type={location.state !== null ? location.state.type : null}
                    items={location.state !== null ? location.state.item : null}
                    onValidationReceived={onValidationReceived}
                  />
                ) : null
              }
            </Container>
            <Button
                variant='secondary'
                onClick={handleBack}
                className='retour'
            >
                Retour
            </Button>
        </div>
        <Footer />

        { /* pour le routeur */}
        <Outlet />
    </div>
  )
}

export default Manager;