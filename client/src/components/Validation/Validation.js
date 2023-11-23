import React from "react";

// react-router-dom
import { Link } from 'react-router-dom';

// style
import style from './Validation.module.css';

// boostrap
import { Button, Modal } from 'react-bootstrap';

const Validation = (props) => {

    const { showValidation, action, item } = props;

    // information utilisateur en cours
    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    let messageValidation = '';
    let modalTitle = '';
    switch (action)
    {
        case 'postuler':
            modalTitle = 'Postuler';
            messageValidation = 'Postulation à l\'offre : "' + item.titre + '" a bien été effectuée';
            break;
        case 'creation_compte':
            modalTitle = 'Creation de compte';
            messageValidation = 'Bienvenue à toi ' + item.prenom + '!';
            break;
        case 'Ajouter':
            modalTitle = 'Ajout';
            messageValidation = 'L\'ajout a bien été effectué';
            break;
        case 'Modifier':
            modalTitle = 'modification';
            messageValidation = 'La modification a bien été effectuée';
            break;
        default:
            break;
    }

    return (
        <div className={style.validationMessage}>
            <Modal
                show={showValidation}
                backdrop='static'
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{messageValidation}</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">
                        <Link to={user !== null ? (user.droit === '1' ? '/admin' : (user.droit === '0' ? '/home' : '/')) : '/'}>Retour à l'acceuil</Link>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Validation;