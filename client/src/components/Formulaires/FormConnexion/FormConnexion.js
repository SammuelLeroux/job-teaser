import React, { useState, useRef } from 'react';

// react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// API
import axios from 'axios';

// style
import style from './FormConnexion.module.css';

// bootstrap
import { Form, InputGroup, Button, CloseButton} from 'react-bootstrap';

//fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// 2 etats : connexion / mdp oublie

const FormConnexion = (props) => {

    const { formType, closeBtn, handleFormSignIn, handleFormResetMdp, handleFormSignUp} = props;

    const navigate = useNavigate();

    // visibilite du mot de passe
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [validated, setValidated] = useState(false);
    
    const emailRef = useRef(null);
    const mdpRef = useRef(null);

    const [validateTips, setValidateTips] = useState('');
    const [countTry, setCountTry] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();

        // verification
        const form = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }

        setValidated(true);
        
        const email = emailRef.current.value;

        const postData = {
            action: formType,
            email: email
        }

        if (formType === 'connexion')
        {
            const mdp = mdpRef.current.value;
            postData.mdp = mdp;
        }

        // on envoie le post
        let urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        
        if (formType === 'connexion')
        {
            const connexion = async () => {

                // on vide le validateTips
                setValidateTips('');

                try {
                    const response = await axios.post(urlRequested, postData, config);
                    response.data = response.data.toString();

                    if (response.data.substr(0, 1) === '1')
                    {
                        // info connexion bonne
                        
                        // on recupere les donnees
                        const userData = JSON.parse(response.data.substr(1));
                        // stockage dans la session du navigateur
                        sessionStorage.setItem('user',  JSON.stringify(userData));
                        
                        setInterval(() => {
                            closeBtn();
                            
                            // redirection
                            userData.droit = parseInt(userData.droit);
                            if (userData.droit === 1) navigate('/admin');
                            else if (userData.droit === 0) navigate('/home');

                            // window.location.reload();
                        }, 500);
                    }
                    else if (response.data.substr(0, 1) === '0')
                    {
                        // info connexion pas bonne
    
                        // on affiche un message d'erreur
                        setValidateTips('Les informations saisies sont incorrectes');
                    }
                }
                catch (error) {
                    console.error(error);
                }
            };

            if (postData.email !== '' && postData.mdp !== '') connexion();
        }
        else if (formType === 'mdpOublie')
        {
            const mdpOublie = async () => {

                // on vide le validateTips
                setValidateTips('');

                try {
                    const response = await axios.post(urlRequested, postData, config);
                    response.data = response.data.toString();

                    if (response.data.substr(0, 1) === '1')
                    {
                        // succes

                        // envoie d'un mail avec un mot de passe pour recuperer le compte

                        // bouton renvoyer si mail pas reçu
                        setCountTry(countTry + 1);
                        setValidateTips('Si vous n\'avez pas reçu de mail, réessayez !')
                    }
                    else 
                    {
                        // erreur

                        // l'email n'existe pas dans notre bdd
                        setValidateTips('Il n\'y a pas de compte associé à cette adresse email');
                    }
                }
                catch (error) {
                    console.error(error);
                }
            };

            if (postData.email !== '') mdpOublie();
        }
    };

    return (
        <div className={style.formBoxW}>
            <div className={style.formBox}>
                <CloseButton
                    onClick={closeBtn}
                    style={{ float : 'right', cursor: 'pointer' }}
                />
                <br />
                <br />
                {
                    formType === "mdpOublie"
                    ? <h2>Mot de passe oublié</h2>
                    : <h2>Se connecter</h2>
                }
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            ref={emailRef}
                            required
                        />
                    </Form.Group>
                    {
                        formType === "mdpOublie"
                        ? <>
                            <div className='validateTips'>{validateTips}</div>
                            <Button type='submit' variant='primary' className='w-100'>{ countTry === 1 ? 'Envoyer' : 'Renvoyer'}</Button>
                        </>
                        : <>
                            <Form.Group className="my-3">
                                <InputGroup>
                                    <Form.Control
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Mot de passe"
                                        ref={mdpRef}
                                        required
                                    />
                                    <InputGroup.Text>
                                        <FontAwesomeIcon
                                            icon={passwordVisible ? faEye : faEyeSlash}
                                            onClick={togglePasswordVisibility}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <div className='validateTips'>{validateTips}</div>
                            <Button
                                type='submit'
                                variant='primary'
                                className='w-100'
                            >
                                Connexion
                            </Button>
                        </>
                    }
                </Form>
                <div className={style.actionCompte}>
                    {
                        formType === 'mdpOublie'
                        ? <>
                            <Link onClick={handleFormSignIn}>Se connecter</Link>
                            <Link onClick={handleFormSignUp}>Créer un compte</Link>
                        </>
                        : <>
                            <Link onClick={handleFormResetMdp}>Mot de passe oublié</Link>
                            <Link onClick={handleFormSignUp}>Créer un compte</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default FormConnexion;