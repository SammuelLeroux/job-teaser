<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');

require_once "C:\wamp64\www\job-teaser\service\config\config.php";


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'C:\wamp64\www\job-teaser\PHPMailer-master\PHPMailer-master\src\Exception.php';
require 'C:\wamp64\www\job-teaser\PHPMailer-master\PHPMailer-master\src\PHPMailer.php';
require 'C:\wamp64\www\job-teaser\PHPMailer-master\PHPMailer-master\src\SMTP.php';

class RepondModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    


    //CREAT//

    public function countRepond($idpersonne, $idannonces) {
        $query = "SELECT count(*) as nbrPostule FROM repond WHERE Id_Personne = :idpersonne AND Id_Annonces = :idannonces";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':idpersonne', $idpersonne, PDO::PARAM_STR);
        $stmt->bindParam(':idannonces', $idannonces, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC)["nbrPostule"];
        $stmt = NULL;

        return $result;
    }
    public function creerRepond($idpersonne, $idannonces, $message) {

            $query = "INSERT INTO repond (Id_Personne, Id_Annonces, message) VALUES (:idpersonne, :idannonces, :message)";


            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':idpersonne', $idpersonne, PDO::PARAM_STR);
            $stmt->bindParam(':idannonces', $idannonces, PDO::PARAM_STR);
            $stmt->bindParam(':message', $message, PDO::PARAM_STR);

            $stmt->execute();

            $stmt = NULL;

            //var_dump($stmt);

            return true; 
        
}

    public function envoiEmail($Id_Annonce, $Id_Personne, $prenom, $email, $telephone, $message) { 

        

        $query = 'SELECT e.email FROM entreprise e JOIN annonces a ON a.Id_Entreprise = e.Id_Entreprise WHERE Id_Annonces = :Id_Annonce';

        $stmt = $this->db->prepare($query);
        $stmt->bindParam('Id_Annonce', $Id_Annonce, PDO::PARAM_INT);

        $stmt->execute();
        
        $emailEntreprise = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //Envoie du mail

        require_once 'C:\wamp64\www\job-teaser\vendor\autoload.php';


        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';               //Adresse IP ou DNS du serveur SMTP
        $mail->Port = 465;                          //Port TCP du serveur SMTP
        $mail->SMTPAuth = 1;                        //Utiliser l'identification
        $mail->CharSet = 'UTF-8';

        if($mail->SMTPAuth){
        $mail->SMTPSecure = 'ssl';               //Protocole de sécurisation des échanges avec le SMTP
        $mail->Username   =  '';    //Adresse email à utiliser
        $mail->Password   =  '';         //Mot de passe de l'adresse email à utiliser
        }

        $mail->From       = trim('');                //L'email à afficher pour l'envoi
        $mail->FromName   = trim($prenom);          //L'alias de l'email de l'emetteur

        $mail->AddAddress("");


        $mail->Subject  =  "Postuler a l'annonce";                      //Le sujet du mail
        $mail->WordWrap = 50; 			       //Nombre de caracteres pour le retour a la ligne automatique
        $mail->Body = $message; 	       //Texte brut
        $mail->IsHTML(false);                                  //Préciser qu'il faut utiliser le texte brut

                    //Forcer le contenu du body html pour ne pas avoir l'erreur "body is empty' même si on utilise l'email en contenu alternatif
        try{
            $mail->send();
            return 1;
        }
        catch(Exception $e){
            return 0;
        }


    }    

    //READ//

    public function searchByAll() {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT a.*, p.*, r.message FROM repond r JOIN annonces a ON a.Id_Annonces = r.Id_Annonces JOIN personne p ON p.Id_Personne = r.Id_Personne" ;

            $stmt = $this->db->prepare($query);

            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = NULL;


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }

    //UPDATE//

    public function updateRepond($idpersonne, $idannonces, $message) {
        try {
            $query = "UPDATE repond set Id_Personne = :idpersonne, Id_Annonces = :idannonces, message = :message WHERE Id_Personne = :idpersonne" ;

            $stmt = $this->db->prepare($query);

            $stmt->bindParam(':idpersonne', $idpersonne, PDO::PARAM_STR);
            $stmt->bindParam(':idannonces', $idannonces, PDO::PARAM_STR);
            $stmt->bindParam(':message', $message, PDO::PARAM_STR);


            $stmt->execute();



            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }

    //DELETE//
    public function deleteByIDPersonne($idpersonne) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "DELETE FROM repond r WHERE r.Id_Personne = :idpersonne";

            $stmt = $this->db->prepare($query);
            $metier = '%' . $idpersonne . '%'; // Recherche partiellement correspondante
            $stmt->bindParam(':idpersonne', $idpersonne, PDO::PARAM_STR);
            $stmt->execute();


            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }
    


}
?>
