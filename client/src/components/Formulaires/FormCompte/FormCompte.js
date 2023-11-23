import React, { useState, useRef } from 'react';

// react-router-dom
import { Link } from 'react-router-dom';

// API
import axios from 'axios';

// style
import style from './FormCompte.module.css';

// bootstrap
import { Form, InputGroup, Button, CloseButton} from 'react-bootstrap';

// fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const FormCompte = (props) => {

    const { closeBtn, handleFormSignIn, handleFormResetMdp} = props;

    // visibilite du mot de passe
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // creation de compte

    const [validated, setValidated] = useState(false);

    const nomRef = useRef(null);
    const prenomRef = useRef(null);
    const dateNaissanceRef = useRef(null);
    const emailRef = useRef(null);
    const telephoneRef = useRef(null);
    const mdpRef = useRef(null);

    const [validateTips, setValidatedTips] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();

        // verification
        const form = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }
      
            setValidated(true);

            const nom = nomRef.current.value;
            const prenom = prenomRef.current.value;
            const date_naissance = dateNaissanceRef.current.value;
            const email = emailRef.current.value;
            const telephone = telephoneRef.current.value;
            const mdp = mdpRef.current.value;

            const postData = {
                action: 'creation_compte',
                nom: nom,
                prenom: prenom,
                date_naissance: date_naissance,
                email: email,
                telephone: telephone,
                mdp: mdp
            }

            // on envoie le post
            let urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/PersonneController.php';
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            
            const createAccount = async () => {

                setValidatedTips('');

                try
                {
                    const response = await axios.post(urlRequested, postData, config);
                    response.data = response.data.toString();

                    if (response.data.substr(0, 1) === '1')
                    {
                        // reussite
                        
                        // page de validation
                        props.onValidationReceived(1, 'creation_compte', {nom: postData.nom, prenom: postData.prenom});
                    }
                    else
                    {
                        // echec

                        // on affiche le premier message d'erreur
                        setValidatedTips(JSON.parse(response.data.substr(1))[0]);
                    }
                }
                catch (error)
                {
                    console.error(error);
                }
            }

            if (postData.action !== '' && postData.nom !== '' && postData.prenom !== '' && postData.date_naissance !== '' && postData.email !== '' && postData.mdp !== '')
            {
                createAccount();
            }
    };

    return (
        <div className={style.formBoxW}>
            <div className={style.formBox}>
                <CloseButton
                    onClick={closeBtn}
                    style={{ float : 'right', cursor: 'pointer' }}
                />
                <h2>Sign Up</h2>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text"
                            placeholder="Nom"
                            ref={nomRef}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text"
                            placeholder="Prenom"
                            ref={prenomRef}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="date"
                            placeholder="Date de naissance"
                            ref={dateNaissanceRef}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            ref={emailRef}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="tel"
                            placeholder="Telephone (optionnel)"
                            ref={telephoneRef}
                            pattern="^0[0-9]{9}"
                            size='10'
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <InputGroup>
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Mot de passe"
                                ref={mdpRef}
                                minLength={8}
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
                        Creer le compte
                    </Button>
                </Form>
                <div className={style.actionCompte}>
                    <Link onClick={handleFormSignIn}>Se connecter</Link>
                    <Link onClick={handleFormResetMdp}>Mot de passe oublié</Link>
                </div>
            </div>
        </div>
    );
}

export default FormCompte;