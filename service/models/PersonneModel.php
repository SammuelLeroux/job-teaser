<?php
require_once "C:\wamp64\www\job-teaser\service\config\config.php";
class PersonneModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }


    //CREAT//

    public function verifierEmailUnique($email) {
        // Vérifiez si l'email est unique dans la base de données
        $query = "SELECT COUNT(*) FROM personne WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $count = $stmt->fetchColumn();
        $stmt = NULL;

        if ($count == 0){
            
            return true;
            
        }
        else{return false;}
        
    }

    public function verifierForceMotDePasse($motDePasse) {
        $erreurs = [];


        // Vérifiez si le mot de passe a plus de 11 caractères
        if (strlen($motDePasse) < 12) {
            $erreurs[] = "Le mot de passe doit avoir au moins 12 caractères.";
        }

        // Vérifiez s'il y a au moins une majuscule
        if (!preg_match('/[A-Z]/', $motDePasse)) {
            $erreurs[] = "Le mot de passe doit contenir au moins une lettre majuscule.";
        }

        // Vérifiez s'il y a au moins une minuscule
        if (!preg_match('/[a-z]/', $motDePasse)) {
            $erreurs[] = "Le mot de passe doit contenir au moins une lettre minuscule.";
        }

        // Vérifiez s'il y a au moins un caractère spécial
        if (!preg_match('/[\W]/', $motDePasse)) {
            $erreurs[] = "Le mot de passe doit contenir au moins un caractère spécial.";
        }


        if (count($erreurs) > 0) {
            return false;
        }
        else{
            return true;
        }

      
    }

    public function creerCompte($nom, $prenom, $mdp, $dateNaissance, $email, $telephone, $droit) {
            

            
            
                // Insérez le nouvel utilisateur dans la base de données
                $query = "INSERT INTO personne (nom, prenom, mdp, date_naissance, email, telephone, droit) VALUES (:nom, :prenom, :mdp, :dateNaissance, :email, :telephone, :droit)";



                $stmt = $this->db->prepare($query);
                $mdp = hash("sha256", $mdp);
                $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
                $stmt->bindParam(':prenom', $prenom, PDO::PARAM_STR);
                $stmt->bindParam(':mdp', $mdp, PDO::PARAM_STR);
                $stmt->bindParam(':dateNaissance', $dateNaissance, PDO::PARAM_STR);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
                $stmt->bindParam(':droit', $droit, PDO::PARAM_STR);

                $stmt->execute();


                $stmt = NULL;


                return true; // Compte créé avec succès
             
    }

    //READ//

    public function searchByAll() {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT p.* FROM personne p" ;

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

    public function searchByEmail($email, $mdp) {
        try {

            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT p.* FROM personne p WHERE p.email = :email AND mdp = :mdp" ;

            $stmt = $this->db->prepare($query);
            $mdp = hash("sha256", $mdp);
            $stmt->bindParam(':mdp', $mdp, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);

            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt = NULL;


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }

    public function VerrifeById($id) {
        try {

            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT p.* FROM personne p WHERE p.Id_Personne = :id " ;

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);

            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt = NULL;

   


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }

    //UPDATE//

    public function updatePersonne($id, $nom, $prenom, $mdp, $datenaissance, $email, $telephone, $droit) {
        try {
            $query = "UPDATE personne set nom = :nom, prenom = :prenom, mdp = :mdp, date_naissance = :datenaissance, email = :email, telephone = :telephone, droit = :droit WHERE Id_Personne = :id" ;

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);   
            $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
            $stmt->bindParam(':prenom', $prenom, PDO::PARAM_STR);
            $stmt->bindParam(':mdp', $mdp, PDO::PARAM_STR);
            $stmt->bindParam(':datenaissance', $datenaissance, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':telephone', $telephone, PDO::PARAM_STR);
            $stmt->bindParam(':droit', $droit, PDO::PARAM_STR);

            $stmt->execute();


            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }

    public function modifierMotDePasse($email) {
        try {
            $query = "SELECT p.* FROM personne p WHERE p.email = :email" ;

            $stmt = $this->db->prepare($query);

            $stmt->bindParam(':email', $email, PDO::PARAM_STR);


            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = NULL;

            if ($result != NULL) {
                
            }


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }


    //UPDATE//

    

    //DELETE//
    public function deleteById($id) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "DELETE FROM personne p WHERE p.Id_Personne = :id";

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
