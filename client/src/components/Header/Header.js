import React, { useState, useEffect } from 'react';

// router
import { Link, useNavigate } from 'react-router-dom';

// style
import style from './Header.module.css';

// boostrap
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

// composants
import FormConnexion from '../Formulaires/FormConnexion/FormConnexion';
import FormCompte from '../Formulaires/FormCompte/FormCompte';
import Validation from '../Validation/Validation';

const Header = () => {

  // information utilisateur en cours
  let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
  if (user !== null) user.droit = parseInt(user.droit);

  const navigate = useNavigate();

  // deconnexion
  const handleLogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
    window.location.reload();
  }

  const [isFormSignInVisible, setFormSignInVisibility] = useState(false);
  const [isFormResetMdpVisible, setFormResetMdpVisibility] = useState(false);
  const [isFormSignUpVisible, setFormSignUpVisibility] = useState(false);
  
  // closeBtn
  const closeBtn = () => {
    setFormSignInVisibility(false);
    setFormResetMdpVisibility(false);
    setFormSignUpVisibility(false);
  }
  
  // sign in
  const handleFormSignIn = () => {
    // masquer tout
    closeBtn();
    // afficher le bon composant
    setFormSignInVisibility(!isFormSignInVisible);
  };

  // mdpOublie
  const handleFormResetMdp = () => {
    // masquer tout
    closeBtn();
    // afficher le bon composant
    setFormResetMdpVisibility(!isFormResetMdpVisible);
  };
  
  // sign up
  const handleFormSignUp = () => {
    // masquer tout
    closeBtn();
    // afficher le bon composant
    setFormSignUpVisibility(!isFormSignUpVisible);
  };
  const [ showValidation, setShowValidation ] = useState(false);
  const [ actionValidation, setActionValidation ] = useState('');
  const [ infoCreationCompte, setInfoCreationCompte ] = useState({});
  const onValidationReceived = (validation, action, item) => {
    if (validation)
    {
      closeBtn();

      setShowValidation(true);
      setActionValidation(action);
      setInfoCreationCompte(item);
    }
  };

  useEffect(() => {}, [navigate, user]);

  // gestion de la barre de recherche via un get
  const handleResearchAds = (selectValue, searchValue) => {

    let key = encodeURIComponent(selectValue);
    let value = encodeURIComponent(searchValue);
    
    const url = new URL(window.location.protocol + '//' + window.location.host + '/home/');
    const urlParams = new URLSearchParams(url.search);
    urlParams.set(key, value);
    window.location.search = urlParams;
  };

  // modifier son compte
  const handleUpdateAccount = () => {
    let action = 'Modifier';
    let type = 'personne';
    /*const userData = {
      nom: user.nom,
      prenom: user.prenom,
      mdp: user.mdp,
      date_naissance: user.date_naissance,
      email: user.email,
      telephone: user.telephone,
      droit: user.droit
    };*/

    navigate('/manager', {
      state: {action, type:type, item:user}
    });
  };

  return (
    <>
      <Validation
        showValidation={showValidation}
        action={actionValidation}
        item={infoCreationCompte}
      />
      {
        isFormSignInVisible ? (
          <FormConnexion
            formType='connexion'
            closeBtn={closeBtn}
            handleFormResetMdp={handleFormResetMdp}
            handleFormSignUp={handleFormSignUp}
          />
        )
        : null
      }
      {
        isFormResetMdpVisible ? (
          <FormConnexion
            formType='mdpOublie'
            closeBtn={closeBtn}
            handleFormSignIn={handleFormSignIn}
            handleFormSignUp={handleFormSignUp}
          />
        )
        : null
      }
      {
        isFormSignUpVisible ? (
          <FormCompte
            closeBtn={closeBtn}
            handleFormSignIn={handleFormSignIn}
            handleFormResetMdp={handleFormResetMdp}
            onValidationReceived={onValidationReceived}
          />
        )
        : null
      }
      <header className={style.header}>
        <Navbar expand="lg">
          <Container fluid className='mx-5 my-3 d-flex flex-row justify-content-between'>
            <div className="logoHeader">
              <Link
                to={user !== null ? (user.droit === 1 ? '/admin' : '/home') : '/home'}
                className="nav-link"
              >
                <Navbar.Brand>JobTeaser</Navbar.Brand>
              </Link>
            </div>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
              className="my-2 my-lg-0"
              style={{ maxHeight: '100px', width: '100%' }}
            >
              <Link
                className="nav-link"
                to={user !== null ? (user.droit === 1 ? '/admin' : '/home') : '/home'}
              >
                <FontAwesomeIcon icon={faHome} />
              </Link>
              {
                (user == null) ?
                // mes-annonces & compte affiché si on est connecté
                <div className='d-flex flex-row'>
                  <Button variant="link"
                    className={style.connexionBtn}
                    onClick={handleFormSignIn}
                  >
                    Sign in
                  </Button>
                  <Button variant="primary"
                    className={style.connexionBtn}
                    onClick={handleFormSignUp}
                  >
                    Sign up
                  </Button>
                </div>
                :
                // sinon afficher sign in / log in
                <div className='connectedBtn'>
                  <Nav.Link href="/mes-annonces">Mes annonces</Nav.Link>
                  <Nav.Link
                    onClick={handleUpdateAccount}
                  >
                    Mon compte
                  </Nav.Link>
                  <Button
                    variant='outline-danger'
                    onClick={handleLogOut}
                  >
                    Log out
                  </Button>
                </div>
              }
            </Nav>
          </Navbar.Collapse>
          </Container>
        </Navbar>
        {
          /* on affiche le formulaire que si on est dans home */
          window.location.pathname === '/home' // || window.location.pathname === '/admin'
          ? <Form
            className="d-flex justify-content-center"
            style={{ width: '40%', margin: '0 auto' }}
          >
            <Form.Select className='w-25 me-2'>
              <option value="annonce">Annonce</option>
              <option value="entreprise">Entreprise</option>
              <option value="lieu">Lieu</option>
            </Form.Select>

            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 bg-body-tertiary"
              aria-label="Search"
            />
            <Button variant="outline-success"
              onClick={() => handleResearchAds(document.querySelector('select').value, document.querySelector('input[type="search"]').value)}
            >
              Search
            </Button>
          </Form>
          : undefined
        }
      </header>
    </>
  );
}

export default Header;