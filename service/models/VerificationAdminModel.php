<?php
class VerificationAdminModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function estAdmin($idUtilisateur) {
        // Vérifiez si l'utilisateur est un administrateur
        $query = "SELECT admin FROM personne WHERE id = :idUtilisateur";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':idUtilisateur', $idUtilisateur, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $resultat = $stmt->fetch(PDO::FETCH_ASSOC);
            return (bool) $resultat['admin']; // Convertit en booléen (true si 1, false si 0)
        }

        return false; // Utilisateur non trouvé ou pas administrateur
    }
}
?>
