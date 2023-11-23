import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
import './styles/Admin.css';

// boostrap
import { Container, Button, Pagination, ButtonGroup, ToggleButton } from 'react-bootstrap';

// composants
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Ad from '../components/Ad/Ad';
import Item from '../components/Item/Item';

const Admin = () => {

    // toutes les annonces -> à la place de postuler : Modifier / Supprimer
    
    // information utilisateur en cours
    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    if (user !== null) user.droit = parseInt(user.droit);

    let isConnected = false;
    if (user != null) isConnected = true;

    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected || user.droit !== 1) {
            navigate('/');
        }
    }, [navigate, isConnected, user]);

    // donnees : annonces, entreprise, utilisateur, repond
    const [data, setData] = useState([]);

    // pagination des tables
    const [tableValue, setTableValue] = useState('1');
    const tables = [
        { name: 'Annonce', value: '1'},
        { name: 'Personne', value: '2'},
        { name: 'Entreprise', value: '3'},
        { name: 'Repond', value: '4'},
    ];

    // const [urlRequested, setUrlRequested] = useState(window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php');
    // const [urlRequested, setUrlRequested] = useState('');

    useEffect(() => {
        
        let postData = {};

        const config = {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const getInfos = async (postData, urlRequested) => {
            try
            {
                const response = await axios.post(urlRequested, postData, config);
                setData(response.data);
            }
            catch (error)
            {
                console.error(error);
            }
        }

        let urlRequested = '';
        switch (tableValue)
        {
            case '1':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php';
                postData = {
                    Id_Personne: user.Id_Personne,
                    action: 'afficherAnnonces',
                    annonce: 'null',
                    entreprise: 'null',
                    lieu: 'null',
                }
                getInfos(postData, urlRequested);
                break;
            case '2':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';
                postData = {
                    Id_Session: user.Id_Personne,
                    action: 'afficherPersonne',
                }
                getInfos(postData, urlRequested);
                break;
            case '3':
                urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/EntrepriseController.php';
                postData = {
                    Id_Personne: user.Id_Personne,
                    action: 'afficherEntreprise',
                    /*entreprise: entreprise,*/
                }
                getInfos(postData, urlRequested);
                break;
            case '4':
                urlRequested =window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/RepondController.php';
                postData = {
                    Id_Session: user.Id_Personne,
                    action: 'afficherRepond',
                }
                getInfos(postData, urlRequested);
                break;
            default:
                break;
        }
        
    }, [tableValue, user.Id_Personne]);

    // mise a jour de la liste des ads de manière asynchrone
    // on stocke temporairement jusquà la recharge
    const handleUpdatedData = (newItemList) => {
        setData(newItemList);
    }

    // repartir les data par paquets de 12 ads
    let ads = [];
    let subpackage = []; // un sous-paquet pour remplir ads, pour la pagination
    for (let i in data)
    {
        // on remplit le sous-paquet
        subpackage.push(data[i]);
        if (subpackage.length === 12)
        {
            // notre sous paquet a une taille de 12, on le mt dans notre tableau des annonces
            ads.push(subpackage);
            // on vide le sous-paquet pour qu'il se remplisse encore par 12
            subpackage = [];
        }
    }
    // on push les derniers paquets restant, c'est forcement un paquet de moins de 12
    ads.push(subpackage);

    // compter pour suivre la pagination (ex : si il y a 2 sous-paquet dans la table ads, alors il n'y a que 2 pages et on ne peut aller que sur les pages 1 et 2)
    const [activePage, setActivePage] = useState(1);
    const handleNextPage = () => {
        if (activePage < ads.length) setActivePage(activePage + 1);
    };
    const handlePrevPage = () => {
        if (activePage > 1) setActivePage(activePage - 1);
    };
    const handleChangePage = (number) => {
        setActivePage(number);
    };

    // pagination
    let items = [];
    let page = Math.round(data.length / 12);
    if (data.length / 12 - Math.round(data.length / 12) > 0) page = Math.round(data.length / 12) + 1;
    for (let number = 1; number < page + 1; number++)
    {
        items.push
        (
            <Pagination.Item key={number} active={number === activePage} onClick={handleChangePage.bind(this, number)}>
                {number}
            </Pagination.Item>
        );
    }

    // adCard size calc
    const calcAdCardSize = (length) => {
        if (length > 2) {
            return 'calc(100% / 3 - 3 * 1em)';
        } else if (length > 1) {
            return 'calc(100% / 2 - 3 * 1em)';
        } else if (length > 0) {
            return 'calc(100% - 3 * 1em)';
        } else {
            return 0;
        }
    };

    // message si pas d'item dans data
    let noItemFound = '';
    let type = '';
    let itemData = '';
    switch (tableValue)
    {
        case '1':
            type = 'Annonces';
            itemData = {
                titre: '',
                description: '',
                salaire: '',
                temps_travail: '',
                job: ''
            };
            noItemFound = 'Aucune annonce n\'a été trouvée';
            break;
        case '2':
            type = 'Personne';
            itemData = {
                nom: '',
                prenom: '',
                mdp: '',
                date_naissance: '',
                email:'',
                telephone: '',
                droit: ''
            };
            noItemFound = 'Aucun utilisateur n\'a été trouvé';
            break;
        case '3':
            type = 'Entreprise';
            itemData = {
                nom: '',
                email: '',
                lieu: ''
            };
            noItemFound = 'Aucune entreprise n\'a été trouvée';
            break;
        case '4':
            type = 'Repond';
            itemData = {
                message: ''
            };
            noItemFound = 'Aucun message n\'a été trouvé';
            break;
        default:
            break;
    }

    // bouton pour ajouter annonce
    const addItem = () => {
        let action = 'Ajouter';
        navigate('/manager', {
            state: {action, type: type.toLowerCase(), item: itemData}
        });
    };

    return (
        <div id="container">
          <Header />
          <div className="runningBox">
                <Container className='h-100 d-flex justify-content-between align-items-center flex-column mb-5 mt-5'>
                        <div className='d-flex flex-wrap justify-content-center align-items-center'>
                            <ButtonGroup className='d-flex flex-wrap'>
                                {
                                    tables.map((table, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`table-${idx}`}
                                            type="radio"
                                            variant='outline-warning'
                                            name="table"
                                            value={table.value}
                                            checked={tableValue === table.value}
                                            onChange={(e) => {setTableValue(e.currentTarget.value);}}
                                            className='w-33'
                                        >
                                            <span className='paginationType'>
                                                {table.name}
                                            </span>
                                        </ToggleButton>
                                    ))
                                }
                            </ButtonGroup>
                            <Button variant="secondary" className='addItem' onClick={addItem}>
                                {'Ajouter ' + tables[parseInt(tableValue) - 1].name }
                            </Button>
                        </div>
                    {
                        data.length > 0 ? (
                            <>
                                <div className='itemsBox'>
                                {
                                    // pour chaque page on map les annonces en fonciton du numero de la page
                                    ads[activePage - 1].map((item, index) => (
                                        tableValue === '1' ? (
                                            <Ad
                                                isConnected={isConnected}
                                                key={index}
                                                item={item}
                                                adCardSize={ calcAdCardSize(ads[activePage - 1].length) }
                                                handleUpdatedAdsList={handleUpdatedData}
                                            />
                                        ) : <Item
                                            key={index}
                                            type={type}
                                            item={item}
                                            itemSize={ calcAdCardSize(ads[activePage - 1].length) }
                                            handleUpdatedData={handleUpdatedData}
                                        />
                                    ))
                                }
                                </div>
                                <Pagination>
                                    <Pagination.Prev onClick={handlePrevPage}/>
                                        {items}
                                    <Pagination.Next onClick={handleNextPage}/>
                                </Pagination>
                            </>
                        ) : <h4 className='mt-5 noItems'>{noItemFound}</h4>
                    }
                </Container>
          </div>
          <Footer />
        </div>
      );
};

export default Admin;