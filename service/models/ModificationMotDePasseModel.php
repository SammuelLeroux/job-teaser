<?php
class ModificationMotDePasseModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function modifierMotDePasse($email, $nouveauMotDePasse) {
        try {
            // Vérifiez d'abord si l'email est associé à un utilisateur
            $query = "SELECT id FROM personne WHERE email = :email";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                // L'email est associé à un utilisateur, mettez à jour le mot de passe
                $query = "UPDATE personne SET mot_de_passe = :nouveauMotDePasse WHERE email = :email";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->bindParam(':nouveauMotDePasse', $nouveauMotDePasse, PDO::PARAM_STR);
                $stmt->execute();

                return true; // Mot de passe modifié avec succès
            } else {
                return false; // L'email n'est pas associé à un utilisateur
            }
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return false;
        }
    }
}
?>
