<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');

require_once 'C:\wamp64\www\job-teaser\service\models\RepondModel.php';
require_once 'C:\wamp64\www\job-teaser\service\models\PersonneModel.php';

if (!in_array($_POST['action'], ['connexion', 'creation_compte'])){
    session_start();
    $verrifsession = new PersonneModel();
    $_SESSION = $verrifsession->VerrifeById($_POST['Id_Session']);
    if($_SESSION == null){
        session_destroy();
        exit();
    }
    
}

//INSERT Repond

if ($_POST['action'] == "postuler") {



if ($_SESSION['droit'] != 1){
    session_destroy();
}


    $countModel = new RepondModel();
    $count = $countModel->countRepond($_POST['Id_Session'], $_POST['Id_Annonces']);
    if ($count > 0) {
        echo 1;
    }
    else {

        if (isset($_POST) ){

            if ($_POST['Id_Session'] == "null"){
                echo "0";
                echo "Erreur champ 'idPrenom' non remplis";
            }
            elseif ($_POST['Id_Annonces'] == "null"){
                echo "0";
                echo "Erreur champ 'idAnnonces' non remplis";
            }
            elseif ($_POST['message'] == "null"){
                echo "0";
                echo "Erreur champ 'message' non remplis";
            }
            else{
                $inscriptionModel = new RepondModel();

                $inscription = ($inscriptionModel->creerRepond($_POST['Id_Session'], $_POST['Id_Annonces'] , $_POST['message']));


                
                    if ($inscription) {
                        echo 1;
                       
                        // Redirigez l'utilisateur vers une page de connexion ou autre
                    } else {
                        echo 0;

                        // Affichez un message d'erreur à l'utilisateur
                    }

                    $envoiEmail = new RepondModel(); 

                    $emailEnvoyer = $envoiEmail->envoiEmail($_POST['Id_Annonces'], $_POST['Id_Session'],$_POST['prenom'], $_POST['email'], $_POST['telephone'],$_POST['message']);
                    
                    
                    if ($envoiEmail) {
                        echo 1;
                        echo" le mail est partie";
                       
                        // Redirigez l'utilisateur vers une page de connexion ou autre
                    } else {
                        echo 0;
                        echo "Le mail n'est pas partie";

                        // Affichez un message d'erreur à l'utilisateur
                    }
                
            }
        
        }
    }
    
}


//READ//
elseif ($_POST['action'] == "insertRepond"){


    if ($_SESSION['droit'] != 1){
        session_destroy();
    }


$resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new RepondModel();
            $resultats = $allModel->creerRepond($_POST['Id_Personne'], $_POST['Id_Annonces'] , $_POST['message']);
            echo 1;
            
        }




        
        

}

elseif ($_POST['action'] == "afficherRepond"){

    if ($_SESSION['Id_Personne'] != $_POST['Id_Session']){
        session_destroy();
    }



        $resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new RepondModel();
            $resultats = $allModel->searchByAll();
            
        }




        
        // Convertir les résultats en JSON
        $jsonResultats = json_encode($resultats);
    
        // Envoyer les résultats en tant que réponse JSON
        header('Content-Type: application/json');
        echo $jsonResultats;
    }


//DELETE//
elseif ($_POST['action'] == "deleteRepond"){



if ($_SESSION['droit'] != 1){
    session_destroy();
}


$resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new RepondModel();
            $resultats = $allModel->deleteByIDPersonne($_POST['Id_Personne']);
            
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
elseif ($_POST['action'] == "updateRepond"){





if ($_SESSION['droit'] != 1){
    session_destroy();
}


    if (isset($_POST) ){
            
        if ($_POST['Id_Personne'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'idPersonne' non remplis"]);
        }
        elseif ($_POST['Id_Annonces'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'idAnnonces' non remplis"]);
        }
        elseif ($_POST['message'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'message' non remplis"]);
        }

        else{
            $insertAnnonce = new RepondModel();


            $inscripton = ($insertAnnonce->updateRepond($_POST['Id_Personne'], $_POST['Id_Annonces'], $_POST['message']));


                echo 1;
            
            
        }
    }
}
?>
