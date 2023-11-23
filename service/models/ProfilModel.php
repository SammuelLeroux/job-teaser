<?php
class ProfilModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function obtenirInformationsUtilisateur($idUtilisateur) {
        // Sélectionnez toutes les informations de l'utilisateur sauf son mot de passe
        $query = "SELECT nom, prenom, date_naissance, email, telephone, droit FROM personne WHERE id = :idUtilisateur";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':idUtilisateur', $idUtilisateur, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        return null; // Aucun utilisateur trouvé
    }
}
?>
