import React, { useState } from 'react';

// react-router-dom
// import { Link, useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
import style from './ManageItem.module.css';

// bootstrap
import { Form, FloatingLabel, Button } from 'react-bootstrap';

const ManageItem = (props) => {

  const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
  if (user !== null) user.droit = parseInt(user.droit);
  
  let { action, type, items } = props;

  let old_Id = null;

  if (type === 'annonces')
  {
    old_Id = {
      Id_Entreprise: items.Id_Entreprise
    }

    delete items.nomEntreprise;
    delete items.lieu;
    delete items.Id_Entreprise;
  }
  else if (type === 'repond')
  {
    old_Id = {
      Id_Annonces: items.Id_Annonces,
      Id_Personne: items.Id_Personne
    };

    items = {
      message: items.message
    }
  }

  const [validated, setValidated] = useState(false);
  const [validateTips, setValidateTips] = useState('');

  // annonce -> Id_Annonces - titre - description - salaire - temps_travail - job(type de job) - Id_Entreprise
  // personne -> Id_Personne - nom - prenom - mdp - date_naissance - email - telephone - droit
  // entreprise -> Id_Entreprise - nom - email - lieu
  // repond -> Id_Annonces - Id_Personne - message

  if (type === 'annonces')
  {
    // recuperer toutes les entreprises
    const getEntreprises = async () => {

      let postData = {
        action: 'afficherEntreprise',
        Id_Personne: user.Id_Personne
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try
      {
        let url = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/EntrepriseController.php';

        const response = await axios.post(url, postData, config);
          
        // on stocke les entreprises
        let packs = [];
        for (let i = 0; i < response.data.length; i++)
        {
          packs.push(response.data[i]);
        }
        localStorage.setItem('entreprises', JSON.stringify(packs));
      }
      catch (error)
      {
        console.error(error);
      }
    }

    getEntreprises();
  }
  const entreprises = localStorage.getItem('entreprises') ? JSON.parse(localStorage.getItem('entreprises')) : null;
  const [entrepriseValue, setEntrepriseValue] = useState(entreprises[0].Id_Entreprise);

  if (type === 'repond')
  {
    // recuperer toutes les entreprises
    const getPersonne = async () => {

      let postData = {
        action: 'afficherPersonne',
        Id_Session: user.Id_Personne
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try
      {
        let url = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';

        const response = await axios.post(url, postData, config);
          
        // on stocke les personne
        let packs = [];
        for (let i = 0; i < response.data.length; i++)
        {
          packs.push(response.data[i]);
        }
        localStorage.setItem('personne', JSON.stringify(packs));
      }
      catch (error)
      {
        console.error(error);
      }
    };
    // recuperer toutes les annonces
    const getAnnonces = async () => {

      let postData = {
        action: 'afficherAnnonces',
        Id_Personne: user.Id_Personne,
        annonce: 'null',
        lieu: 'null',
        entreprise: 'null'
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try
      {
        let url = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php';

        const response = await axios.post(url, postData, config);
          
        // on stocke les personne
        let packs = [];
        for (let i = 0; i < response.data.length; i++)
        {
          packs.push(response.data[i]);
        }
        localStorage.setItem('annonces', JSON.stringify(packs));
      }
      catch (error)
      {
        console.error(error);
      }
    };

    const getRepond = () => {
      getPersonne();
      getAnnonces();
    };

    getRepond();
  }
  const personne = localStorage.getItem('personne') ? JSON.parse(localStorage.getItem('personne')) : null;
  const annonces = localStorage.getItem('annonces') ? JSON.parse(localStorage.getItem('annonces')) : null;
  const [annoncesValue, setAnnoncesValue] = useState(old_Id != null ? old_Id.Id_Annonces : null);
  const [personneValue, setPersonneValue] = useState(old_Id != null ? old_Id.Id_Personne : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // verification
    const form = e.currentTarget;
    if (form.checkValidity() === false)
    {
      e.stopPropagation();
    }

    setValidated(true);

    let postData = {};

    if (type === 'personne' || type === 'repond')
    {
      postData.Id_Session = user.Id_Personne;
    }

    if (type === 'annonces')
    {
      postData.Id_Entreprise = parseInt(entrepriseValue);
    }

    if (type === 'repond')
    {
      postData.Id_Annonces = parseInt(annoncesValue);
      postData.Id_Personne = parseInt(personneValue);
    }
    else
    {
      postData.Id_Personne = user.Id_Personne;
    }

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    let arrayKey = Object.keys(items);
    for (let i = 0; i < arrayKey.length; i++)
    {
      // stocker l'id de l'item
      if (arrayKey[i] === 'Id_' + type.charAt(0).toUpperCase() + type.slice(1)) postData[arrayKey[i]] = items[arrayKey[i]];
      else
      {
        if (action === 'Ajouter') postData[arrayKey[i]] = form[i].value;
        else if (action === 'Modifier')
        {
          if (type === 'repond') postData[arrayKey[i]] = form[0].value;
          else postData[arrayKey[i]] = form[i - 1].value;
        }
      }
    }

    let urlRequested = '';
    switch(type)
    {
      case 'annonces':

        // postData
        if (action === 'Modifier') postData.action = 'updateAnnonces';
        else if (action === 'Ajouter') postData.action = 'insertAnnonces';
        // urlRequested
        urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/AnnonceController.php';
        break;
      case 'personne':
        // postData
        if (action === 'Modifier') postData.action = 'updatePersonne';
        else if (action === 'Ajouter') postData.action = 'creation_compte';
        // urlRequested
        urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';
        break;
      case 'entreprise':

        // postData
        if (action === 'Modifier') postData.action = 'updateEntreprise';
        else if (action === 'Ajouter') postData.action = 'insertEntreprise';
        // urlRequested
        urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/EntrepriseController.php';
        break;
      case 'repond':

        // postData
        if (action === 'Modifier') postData.action = 'updateRepond';
        else if (action === 'Ajouter') postData.action = 'insertRepond';
        // urlRequested
        urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/RepondController.php';
        break;
      default:
        break;
    }

    // console.log(postData);

    // fonction asynchrone
    const manageItem = async () => {
          
      setValidateTips('');

      try
      {
        const response = await axios.post(urlRequested, postData, config);
        response.data = response.data.toString();
        
        if (response.data.substr(0, 1) === '1')
        {
          // reussite
          
          // on retourne à l'accueil et on recharge la page
          props.onValidationReceived(1, action);
        }
        else
        {
          // echec

          setValidated(false);
          // on affiche un message d'erreur
          setValidateTips('Erreur lors de l\'enregistrement en base de données. Veuillez réessayer');
        }
      }
      catch (error)
      {
        console.error(error);
      }
    };

    let postIsValid = true;
    for (let i in postData)
    {
      if (postData[i] === '')
      {
        postIsValid = false;
      }
    }
    
    if (postIsValid) manageItem();
  };

  return (
    <div className='w-75'>
      <h2 className='my-5 text-center'>{action + ' ' + type}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className={style.formBox}>
          {
            Object.keys(items).map((key) => (
              (key.substring(0, 3) !== 'Id_') ? (
                <Form.Group key={key} className='my-3'>
                  <Form.Label>{key}</Form.Label>
                  {
                    key === 'description' ? (
                      <FloatingLabel>
                        <Form.Control
                          as="textarea"
                          style={{ height: '150px' }}
                          defaultValue={items[key] ? items[key] : undefined}
                          required
                        />
                      </FloatingLabel>
                    )
                    : (
                      <Form.Control
                        type='text'
                        placeholder={key}
                        defaultValue={items[key] ? items[key] : undefined}
                        required
                      />
                    )
                  }
                </Form.Group>
              )
              : null
            ))
          }
          {
            type === 'annonces' && entreprises !== null ? (
            <Form.Select
              value={entrepriseValue}
              onChange={(e) => {setEntrepriseValue(e.target.value)}}
            >
              {
                entreprises.map((entreprise) => (
                  <option value={entreprise.Id_Entreprise} key={entreprise.Id_Entreprise} selected={entreprise.Id_Personne === old_Id.Id_Personne ? true : null}>
                    {entreprise.nom}
                  </option>
                ))
              }
            </Form.Select>
            ) : null
          }
          {
            type === 'repond' && personne !== null && annonces !== null ? (
            <>
              <Form.Select
                value={personneValue}
                onChange={(e) => {setPersonneValue(e.target.value)}}
              >
                {
                  personne.map((element) => (
                    <option value={element.Id_Personne} key={element.Id_Personne} selected={element.Id_Personne === old_Id.Id_Personne ? true : null}>
                      {element.nom + ' ' + element.prenom}
                    </option>
                  ))
                }
              </Form.Select><br />
              <Form.Select
                value={annoncesValue}
                onChange={(e) => {setAnnoncesValue(e.target.value)}}
              >
                {
                  annonces.map((element) => (
                    <option value={element.Id_Annonces} key={element.Id_Annonces} selected={element.Id_Annonces === old_Id.Id_Annonces ? true : null}>
                      {element.titre}
                    </option>
                  ))
                }
              </Form.Select>
            </>
            ) : null
          }
          <div className='validateTips'>{validateTips}</div>
          <Button
            type='submit'
            variant='primary'
            className='w-100'
          >
            {
              action === 'Modifier' ? 'Enregistrer' : (action === 'Ajouter' ? 'Valider' : '')
            }
          </Button>
      </Form>
    </div>
  );
}

export default ManageItem
