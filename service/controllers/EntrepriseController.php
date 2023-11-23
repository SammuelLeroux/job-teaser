<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');

require_once 'C:\wamp64\www\job-teaser\service\models\EntrepriseModel.php';
require_once 'C:\wamp64\www\job-teaser\service\models\PersonneModel.php';

if (!in_array($_POST['action'], ['connexion', 'creation_compte'])){
    session_start();
    $verrifsession = new PersonneModel();
    $_SESSION = $verrifsession->VerrifeById($_POST['Id_Personne']);
    if($_SESSION == null){
        session_destroy();
        exit();
    }
    
}

//INSERT ENTREPRISE
if ($_POST['action'] == "insertEntreprise") {

    if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
        session_destroy();
    }

    if ($_SESSION['droit'] != 1){
        session_destroy();
    }



    if (isset($_POST) ){

        if ($_POST['nom'] == "null"){
            echo "0";
            echo "Erreur champ 'nom' non remplis";
        }
        elseif ($_POST['email'] == "null"){
            echo "0";
            echo "Erreur champ 'email' non remplis";
        }
        elseif ($_POST['lieu'] == "null"){
            echo "0";
            echo "Erreur champ 'telephone' non remplis";
        }
        else{
            $inscriptionModel = new EntrepriseModel();

            $verifemail = $inscriptionModel->verifierEmailUnique($_POST['email']);



            if ($verifemail == true){

                $inscripton = ($inscriptionModel->creerEntreprise($_POST['nom'], $_POST['email'] , $_POST['lieu']));

                echo 1;
            
            }
            else{ 
                echo 0;
            }
        }
    }
}

//READ//

elseif ($_POST['action'] == "afficherEntreprise"){

    if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
        session_destroy();
    }



        $resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new EntrepriseModel();
            $resultats = $allModel->searchByAll();
            
        }




        
        // Convertir les résultats en JSON
        $jsonResultats = json_encode($resultats);
    
        // Envoyer les résultats en tant que réponse JSON
        header('Content-Type: application/json');
        echo $jsonResultats;
    }


    //DELETE//
    elseif ($_POST['action'] == 'deleteEntreprise'){

        if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
            session_destroy();
        }

        if ($_SESSION['droit'] != 1){
            session_destroy();
        }


$resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new EntrepriseModel();
            $resultats = $allModel->deleteById($_POST['Id_Entreprise']);
            
        }


        if ($resultats) {
            echo 1;

            $resultats = $allModel->searchByAll();
            echo json_encode($resultats);
            
            // Redirigez l'utilisateur vers une page de connexion ou autre
        } else {
            echo 0;

            // Affichez un message d'erreur à l'utilisateur
        }
    
    }


    //UPDATE//
    elseif ($_POST['action'] == 'updateEntreprise'){

        if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
            session_destroy();
        }

        if ($_SESSION['droit'] != 1){
            session_destroy();
        }

        


if (isset($_POST) ){
        
        if ($_POST['Id_Entreprise'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'id' non remplis"]);
        }
        elseif ($_POST['nom'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'nom' non remplis"]);
        }
        elseif ($_POST['email'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'email' non remplis"]);
        }
        elseif ($_POST['lieu'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'lieu' non remplis"]);
        }

        else{
            $insertAnnonce = new EntrepriseModel();


            $inscripton = ($insertAnnonce->updateEntreprise($_POST['Id_Entreprise'], $_POST['nom'], $_POST['email'], $_POST['lieu']));


                // Vérifiez si le compte a été créé avec succès
                if ($inscripton) {
                    echo 1;

                    // Redirigez l'utilisateur vers une page de connexion ou autre
                } else {
                    echo 0;
         
                    // Affichez un message d'erreur à l'utilisateur
                }
            
            
        }
        }
    }
?>
