import React, { useState, useEffect } from 'react';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
import './styles/MesAnnonces.css';

// boostrap
import Container from 'react-bootstrap/Container';
import Pagination from 'react-bootstrap/Pagination';

// composants
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Ad from '../components/Ad/Ad';

function MesAnnonces () {

  // information utilisateur en cours
  let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
  if (user !== null) user.droit = parseInt(user.droit);
  
  let isConnected = false;
  if (user != null) isConnected = true;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected)
    {
      navigate('/');
    }
  }, [navigate, isConnected]);
  
  const [data, setData] = useState([]);

  // API -> recuperer toutes les annonces
  let urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php';
  useEffect(() => {

    let postData = {
      action: 'afficherAnnoncesById',
      Id_Personne: user.Id_Personne,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const getAds = async () => {
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

    getAds();
  }, [urlRequested, user.Id_Personne]);

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

  return (
    <div id="container">
      <Header />
      <div className="runningBox">
        <Container className='d-flex flex-column align-items-center mb-5'>
            <h2 className='mt-5'>Mes annonces</h2>
            {
                data.length > 0 ? (
                <>
                    <div className='adsBox'>
                    {
                        // pour chaque page on map les annonces en fonciton du numero de la page
                        ads[activePage - 1].map((item, index) => (
                        <Ad
                            isConnected={isConnected}
                            key={index}
                            item={item}
                            adCardSize={ calcAdCardSize(ads[activePage - 1].length) }
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
                ) : <h4 className='noAds'>Aucune annonce n'a été trouvée.</h4>
            }
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default MesAnnonces;