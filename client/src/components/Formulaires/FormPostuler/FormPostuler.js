import React, { useState, useRef } from 'react';

// API
import axios from 'axios';

// style
import style from './FormPostuler.module.css';

// bootstrap
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

const FormPostuler = (props) => {
    
    const { user, item } = props;

    const [validated, setValidated] = useState(false);
    
    const nomRef = useRef(null);
    const prenomRef = useRef(null);
    const emailRef = useRef(null);
    const telephoneRef = useRef(null);
    const messageRef = useRef(null);

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
    
        // info perso
        const nom = nomRef.current.value;
        const prenom = prenomRef.current.value;
        const email = emailRef.current.value;
        const telephone = telephoneRef.current.value;
        const message = messageRef.current.value;

        const postData = {
            action: 'postuler',
            Id_Annonces: item.Id_Annonces,
            Id_Session: user.Id_Personne,
            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            message: message
        }

        // on envoie le post
        let urlRequested = window.location.protocol + '//' + window.location.hostname + '/client/service/controllers/RepondController.php';
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const postuler = async () => {
            
            setValidatedTips('');

            try
            {
                const response = await axios.post(urlRequested, postData, config);
                response.data = response.data.toString();
                
                if (response.data.substr(0, 1) === '1')
                {
                    // reussite
                    
                    // on retourne à l'accueil et on recharge la page
                    props.onValidationReceived(1, 'postuler');
                }
                else
                {
                    // echec

                    setValidated(false);
                    // on affiche le premier message d'erreur
                    setValidatedTips(JSON.parse(response.data.substr(1))[0]);
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }
        
        if (validated && postData.nom !== '' && postData.prenom !== '' && postData.email !== '')
        {
            postuler();
        }
    };

    return (
        <div className={style.formBox}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h1>Postuler</h1>
                <article className={style.infoPerso}>
                    <h5>Informations Personnelles</h5>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text" 
                            placeholder="Nom"
                            ref={nomRef}
                            defaultValue={user != null ? user.nom : undefined}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="text"
                            placeholder="Prenom"
                            ref={prenomRef}
                            defaultValue={user != null ? user.prenom : undefined}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            ref={emailRef}
                            defaultValue={user != null ? user.email : undefined}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="tel"
                            placeholder="Telephone (optionnel)"
                            ref={telephoneRef}
                            defaultValue={user != null ? user.telephone : undefined}
                            pattern="^0[0-9]{9}"
                            size='10'
                        />
                    </Form.Group>
                </article>
                <article className={style.infoPostuler}>
                    <h5>Informations Professionnelles</h5>
                    <Form.Group className="my-3">
                        <Form.Control
                            type="file"
                            required
                        />
                    </Form.Group>
                    <FloatingLabel label="Message (max 1000 caract.)">
                        <Form.Control
                        as="textarea"
                        style={{ height: '100px' }}
                        ref={messageRef}
                        />
                    </FloatingLabel>
                </article>
                <div className='validateTips'>{validateTips}</div>
                <Button type='submit' className="mt-3" variant="success">Apply</Button>
            </Form>
        </div>
    );
};

export default FormPostuler;