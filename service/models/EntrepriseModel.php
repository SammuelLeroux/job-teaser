<?php
require_once "C:\wamp64\www\job-teaser\service\config\config.php";
class EntrepriseModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }


    //CREAT//

    public function verifierEmailUnique($email) {
        // Vérifiez si l'email est unique dans la base de données
        $query = "SELECT COUNT(*) FROM entreprise WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $count = $stmt->fetchColumn();
        $stmt = NULL;
        var_dump($count);

        if ($count == 0){
            return true;
            
        }
        else{
            return false;
        }
        
    }

    public function creerEntreprise($nom, $email, $lieu) {


            // Vérifiez la force du mot de passe

                // Insérez le nouvel utilisateur dans la base de données
                $query = "INSERT INTO entreprise (nom, email, lieu) VALUES (:nom, :email, :lieu)";


                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->bindParam(':lieu', $lieu, PDO::PARAM_STR);

                $stmt->execute();

                $stmt = NULL;

                //var_dump($stmt);

                return true; // Compte créé avec succès
            
    }

    //READ//

    public function searchByAll() {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT e.* FROM entreprise e" ;

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

    public function updateEntreprise($id, $nom, $email, $lieu) {
        try {
            $query = "UPDATE entreprise set nom = :nom, email = :email, lieu = :lieu WHERE Id_Entreprise = :id" ;

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':lieu', $lieu, PDO::PARAM_STR);

            $stmt->execute();

            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }

    //DELETE//
    public function deleteByID($id) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "DELETE FROM entreprise e WHERE e.Id_Entreprise = :id";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
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
