import React from 'react';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
// import style from './Item.module.css';

import { Button } from 'react-bootstrap';

const Item = (props) => {

    // personne -> Id_Personne - nom - prenom - mdp - date_naissance - email - telephone - droit
    // entreprise -> Id_Entreprise - nom - email - lieu
    // repond -> Id_Annonces - Id_Personne - message

    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    const { type, item, itemSize } = props;

    const navigate = useNavigate();

    let display= {}
    
    if (type === 'Personne') {
        display.elem1 = item.nom;
        display.elem2 = item.prenom;
        display.elem3 = item.email;
    }
    else if (type === 'Entreprise') {
        display.elem1 = item.nom;
        display.elem2 = item.lieu;
        display.elem3 = item.email;
    }
    else if (type === 'Repond') {
        display.elem1 = item.nomPersonne;
        display.elem2 = item.nomEntreprise;
        display.elem3 = item.message;
    }

    // redirection vers la page pour modifier annonces
    const updateItem = (item) => {
        let action = 'Modifier'
        navigate('/manager', {
            state: {action, type:type.toLowerCase(), item:item}
        });
    };

    // effacer annonces
    const deleteItem = async (item) => {

        // on envoie le post
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const postData = {};

        let urlRequested = '';
        switch (type)
        {
            case 'Personne':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';
                postData.action = 'deletePersonne';
                postData.Id_Session = user.Id_Personne;
                postData.Id_Personne = item.Id_Personne;
                break;
            case 'Entreprise':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/EntrepriseController.php';
                postData.action = 'deleteEntreprise';
                postData.Id_Personne = user.Id_Personne;
                postData.Id_Entreprise = item.Id_Entreprise;
                break;
            case 'Repond':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/RepondController.php';
                postData.action = 'deleteRepond';
                postData.Id_Session = user.Id_Personne;
                postData.Id_Personne = item.Id_Personne;
                postData.Id_Annonces = item.Id_Annonces;
                break;
            default:
                break;
        }

        try {
            const response = await axios.post(urlRequested, postData, config);
            response.data = response.data.toString();

            if (response.data.substr(0, 1) === '1')
            {
                //  suppression ok
                
                // on recupere la liste des annonces à jour sans recharger la page
                props.handleUpdatedData(JSON.parse(response.data.substr(1)));
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='itemCard' style={{width: itemSize}}>
            <article>
                <h3>
                    {display.elem1}{type === 'Personne' ? ' ' + display.elem2 : null}
                </h3>
                <p>
                    {
                        type === 'Personne' ? (
                            null
                        ) : <>
                            <span>{display.elem2}</span><br />
                        </>
                    }
                    <span>{display.elem3}</span><br />
                </p>
                <div className="text-center d-flex flex-row align-items-center justify-content-center">
                    <Button variant="outline-secondary" onClick={updateItem.bind(this, item)}>Modifier</Button>
                    <Button variant="outline-danger ms-3" onClick={deleteItem.bind(this, item)}>Supprimer</Button>
                </div>
            </article>
        </div>
    );

};

export default Item;