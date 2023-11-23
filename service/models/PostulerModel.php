<?php
class ApplicationModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function postulerAnnonce($idAnnonce, $idPersonne, $message) {
        try {
            // Insérer les données dans la table "repond"
            $query = "INSERT INTO repond (annonce_id, personne_id, message, cv) VALUES (:idAnnonce, :idPersonne, :message)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':idAnnonce', $idAnnonce, PDO::PARAM_INT);
            $stmt->bindParam(':idPersonne', $idPersonne, PDO::PARAM_INT);
            $stmt->bindParam(':message', $message, PDO::PARAM_STR);
            $stmt->execute();

            // Envoyer l'e-mail à l'entreprise
            $sujet = "Candidature pour votre annonce";
            $messageEmail = "Un candidat a postulé pour votre annonce. Voici son message :\n\n$message";
            $headers = "From: " . "votre_email@example.com"; // Remplacez par l'adresse e-mail de l'expéditeur

            // Vous pouvez utiliser la fonction mail() ou une bibliothèque de messagerie pour envoyer l'e-mail
            mail($sujet, $messageEmail, $headers);

            return true;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return false;
        }
    }
}
?>
