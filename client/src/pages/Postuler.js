import React, { useEffect, useState } from 'react';

// react-router-dom
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// style
import './styles/Postuler.css';

// bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FormPostuler from '../components/Formulaires/FormPostuler/FormPostuler';
import Ad from '../components/Ad/Ad';
import Validation from '../components/Validation/Validation';

const Postuler =  () => {

  
  // on recupere les informations de l'utilisateur
  let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
  if (user !== null) user.droit = parseInt(user.droit);

  let isConnected = false;
  if (user != null) isConnected = true;
  
  // on recupere les informations de l'annonces
  const location = useLocation();
  
  // si l'utilisateur veut court-circuiter pour aller sur la page postuler, on le redirectionne vers l'acceuil
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      if (location.state == null)
      {
        navigate('/home');
      }
    }
    else navigate('/');
  }, [navigate, user, location]);

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
          item={location.state !== null ? location.state.item : null}
        />
        : null
      }
      <Header />
      <div className="runningBox">
        <Container className='postulerW'>
          { location.state != null ? <Ad item={location.state.item} className="ad"/> : null }
          <FormPostuler
            user={user}
            item={location.state != null ? location.state.item : null}
            onValidationReceived={onValidationReceived}
          />
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
  );
};

export default Postuler;