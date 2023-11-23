import React, { useState } from 'react';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
import style from './Ad.module.css';

// bootstrap
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

// fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const Ad = (props) => {

    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    const {isConnected, item, adCardSize} = props;

    const [isDisplayed, setIsDisplayed] = useState(true);
    const [isDisplayed2, setIsDisplayed2] = useState(false);
    const handleLearnMore = () => {
        if (isDisplayed)
        {
            setIsDisplayed(false);
            setIsDisplayed2(true);
        }
        else
        {
            setIsDisplayed(true);
            setIsDisplayed2(false);
        }
    };
    const displaySection = {
        display: isDisplayed ? 'block' : 'none'
    };
    const displaySection2 = {
        display: isDisplayed2 ? 'block' : 'none'
    };


    // change text-decoration h3
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const titleStyle = {
        textDecoration: isHovered ? 'underline' : 'none'
    };

    // redirection vers la page pour postuler
    const navigate = useNavigate();
    const openAd = (item) => {
        navigate('/postuler', {
            state: {item:item}
        });
    };

    // redirection vers la page pour modifier annonces
    const updateAd = (item) => {
        let action = 'Modifier'
        let type = 'annonces';
        navigate('/manager', {
            state: {action, type, item:item}
        });
    };

    // effacer annonces
    const deleteAd = async (Id_Annonces) => {

        // on envoie le post
        let urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php';
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const postData = {
            action: 'deleteAnnonces',
            Id_Personne: user.Id_Personne,
            Id_Annonces: Id_Annonces
        }

        try {
            const response = await axios.post(urlRequested, postData, config);
            response.data = response.data.toString();

            if (response.data.substr(0, 1) === '1')
            {
                //  suppression ok
                
                // on recupere la liste des annonces à jour sans recharger la page
                props.handleUpdatedAdsList(JSON.parse(response.data.substr(1)));
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    // annonce -> Id_Annonces - titre - description - salaire - temps_travail - job(type de job) - nomEntreprise - email - lieu

    return(
        <div className="adCard" style={{width: adCardSize}}>
            <section
                style={displaySection}
                onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            >
                <OverlayTrigger
                    key={'bottom'}
                    placement={'bottom'}
                    overlay={<Tooltip id="tooltip">Learn more</Tooltip>}
                >
                    <FontAwesomeIcon
                        icon={faCircleInfo}
                        style={{ float : 'right', fontSize : '1.5em', cursor: 'pointer' }}
                        onClick={handleLearnMore}
                    />
                </OverlayTrigger>
                <article>
                    <h3 style={titleStyle}>{item.titre ? item.titre : null}</h3>
                    <p className={style.entreprise}>
                        <span className='nomEntreprise'>{item.nomEntreprise ? item.nomEntreprise : null}</span><br />
                        <span className='lieuEntreprise'>{item.lieu ? item.lieu : null}</span>
                    </p>
                    <p className={style.desc}>
                    {
                        item.description ? (item.description.length > 100 ? item.description.slice(0, 100) + '...' : item.description) : null
                    }
                    </p>
                </article>
                <div className="text-center">
                {
                    isConnected ?
                    (
                        window.location.pathname === '/home' ? (
                            <div className="text-center">
                                <Button variant="outline-secondary" onClick={openAd.bind(this, item)}>Postuler</Button>
                            </div>
                        ) : (
                            window.location.pathname === '/admin' ? (
                                <div className="text-center">
                                    <Button variant="outline-secondary" onClick={updateAd.bind(this, item)}>Modifier</Button>
                                    <Button variant="outline-danger ms-3" onClick={deleteAd.bind(this, item.Id_Annonces)}>Supprimer</Button>
                                </div>
                            ) : null
                        )
                    )
                    : null
                }
                </div>
            </section>
            <section style={displaySection2}>
                <CloseButton
                    onClick={handleLearnMore}
                    style={{ float : 'right', cursor: 'pointer' }}
                />
                <article>
                    <h3>{item.titre}</h3>
                    <p className={style.entreprise}>
                        <span className='entreprise'>{item.nomEntreprise ? item.nomEntreprise : null}</span><br />
                        <span className='lieu'>{item.lieu ? item.lieu : null}</span><br />
                        <span className={style.travail}>
                            <Badge bg="secondary">{item.job ? item.job : null}</Badge>
                            <Badge bg="secondary">{item.salaire ? item.salaire : null} $</Badge>
                            <Badge bg="secondary">{item.temps_travail ? item.temps_travail : null} H</Badge>
                        </span>
                    </p>
                    <p className={style.desc}>{item.description ? item.description : null}</p>
                </article>
                {
                    /* on ne peut acceder à la page postuler que depuis la page home */
                    (isConnected && window.location.pathname === '/home') ?
                    <div className="text-center">
                        <Button variant="outline-secondary" onClick={openAd.bind(this, item)}>Postuler</Button>
                    </div>
                    : null
                }
            </section>
        </div>
    );

};

export default Ad;