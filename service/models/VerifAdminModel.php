<?php
require_once "C:\wamp64\www\job-teaser\service\config\config.php";
class PersonneModel {
    private $db;

    public function __construct() {
        // Initialisez votre connexion à la base de données ici
        $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function searchByAll() {
        try {
            // Écrivez votre requête SQL pour rechercher des annonces par métier
            $query = "SELECT p.* FROM personne p" ;

            $stmt = $this->db->prepare($query);

            $stmt->execute();


            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Erreur de base de données : " . $e->getMessage();
            return [];
        }
    }
}