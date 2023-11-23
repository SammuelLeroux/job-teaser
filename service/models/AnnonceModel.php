<?php
require_once "C:\wamp64\www\job-teaser\service\config\config.php";
class AnnonceModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    //CREATE//

    public function insertAnnonce($titre, $description, $salaire, $tempstravail, $job, $idEntreprise) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "INSERT INTO annonces (titre, description, salaire, temps_travail, job, Id_Entreprise) Values (:titre, :description, :salaire, :tempstravail, :job, :idEntreprise) " ;

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':titre', $titre, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':salaire', $salaire, PDO::PARAM_INT);
            $stmt->bindParam(':tempstravail', $tempstravail, PDO::PARAM_INT);
            $stmt->bindParam(':job', $job, PDO::PARAM_STR);
            $stmt->bindParam(':idEntreprise', $idEntreprise, PDO::PARAM_STR);


            $stmt->execute();

            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }

    //READ//

    //ALL
    public function searchByAll() {
        try {
            $query = "SELECT a.*, e.nom AS nomEntreprise, e.lieu FROM annonces a JOIN entreprise e ON e.Id_Entreprise = a.Id_Entreprise" ;

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

    //By Entreprise
    public function searchByEntreprise($entreprise) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT a.* FROM annonces a JOIN entreprise e ON a.Id_Entreprise = e.Id_Entreprise WHERE e.nom LIKE :entreprise";

            $stmt = $this->db->prepare($query);
            $entreprise = '%' . $entreprise . '%'; // Recherche partiellement correspondante

            $stmt->bindParam(':entreprise', $entreprise, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = NULL;


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }


    //By Job
    public function searchByTitre($metier) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT a.* FROM annonces a WHERE a.job LIKE :metier";

            $stmt = $this->db->prepare($query);
            $metier = '%' . $metier . '%'; // Recherche partiellement correspondante
            $stmt->bindParam(':metier', $metier, PDO::PARAM_STR);
            //var_dump($metier);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = NULL;


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }


    //By Lieu
    public function searchByLieu($lieu) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT a.* FROM annonces a JOIN entreprise e ON a.Id_Entreprise = e.Id_Entreprise WHERE e.lieu LIKE :lieu";

            $stmt = $this->db->prepare($query);
            $lieu = '%' . $lieu . '%'; // Recherche partiellement correspondante
            $stmt->bindParam(':lieu', $lieu, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = NULL;


            return $result;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }

    public function searchByIdPersonne($Id_Personne) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT a.* FROM annonces a JOIN repond r ON r.Id_Annonces = a.Id_Annonces JOIN personne p ON r.Id_Personne = p.Id_Personne WHERE p.Id_Personne = :Id_Personne";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':Id_Personne', $Id_Personne, PDO::PARAM_STR);
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

    public function updateAnnonce($id, $titre, $description, $salaire, $temps_travail, $job, $identreprise) {
        try {
            $query = "UPDATE annonces set titre = :titre, description = :description, salaire = :salaire, temps_travail = :tempstravail, job = :job, Id_Entreprise = :identreprise WHERE Id_Annonces = :id" ;

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':titre', $titre, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':salaire', $salaire, PDO::PARAM_STR);
            $stmt->bindParam(':tempstravail', $temps_travail, PDO::PARAM_STR);
            $stmt->bindParam('job', $job, PDO::PARAM_STR);
            $stmt->bindParam(':identreprise', $identreprise, PDO::PARAM_STR);

            $stmt->execute();

            $stmt = NULL;


            return 1;
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return 0;
        }
    }

    //DELETE//
    public function deleteById($id) {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "DELETE FROM annonces a WHERE a.Id_Annonces = :id";

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
