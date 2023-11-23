<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');



require_once 'C:\wamp64\www\job-teaser\service\models\AnnonceModel.php';
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




//READ ANNONCE 


if ($_POST['action'] == "afficherAnnonces") {


    if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
        session_destroy();
    }


        $resultats = [];


        if (isset($_POST) ){

            if ($_POST['annonce'] != "null"){

                $annonceModel = new AnnonceModel();
                $resultats[] = $annonceModel->searchByTitre($_POST['annonce']);
               
            }

            if($_POST['entreprise'] != "null"){
                $entrepriseModel = new AnnonceModel();
                $resultats[] = $entrepriseModel->searchByEntreprise($_POST['entreprise']);
            }

            if($_POST['lieu'] != "null"){
                $lieuModel = new AnnonceModel();
                $resultats[] = $lieuModel->searchByLieu($_POST['lieu']);
            }
            if($_POST['annonce'] == "null" && $_POST['entreprise'] == "null" && $_POST['lieu'] == "null" ){
                $allModel = new AnnonceModel();
                $resultats = $allModel->searchByAll();
            }
        }

        $resultatsfinal = [];
        if($_POST['annonce'] == "null" && $_POST['entreprise'] == "null" && $_POST['lieu'] == "null" ){
            $resultatsfinal = $resultats;
        }
        else{
                /*var_dump($resultats);*/
        
            foreach($resultats as $annonces){
                foreach($annonces as $annonce){
                    $resultatsfinal[] = $annonce;
                }
            
            }
        }
        
        // Convertir les résultats en JSON
        $jsonResultats = json_encode($resultatsfinal);
    
        // Envoyer les résultats en tant que réponse JSON
        header('Content-Type: application/json');
        echo $jsonResultats;
}

elseif ($_POST['action'] == "afficherAnnoncesById"){

    if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
        session_destroy();
    }

    if ($_POST['Id_Personne'] == "null"){
        echo "0";
        echo json_encode(["Erreur champ 'Id_Personne' non remplis"]);
    }

    $afficherMesAnnonces = new AnnonceModel();

    $resultats = $afficherMesAnnonces->searchByIdPersonne($_POST['Id_Personne']);

    foreach($resultats as $annonces){
        foreach($annonces as $annonce){
            $resultatsfinal[] = $annonce;
        }
    
    }

    // Convertir les résultats en JSON
    $jsonResultats = json_encode($resultats);
    
    // Envoyer les résultats en tant que réponse JSON
    header('Content-Type: application/json');
    echo $jsonResultats;



}


elseif ($_POST['action'] == "insertAnnonces"){

   
//INSERT ANNONCE 

if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
    session_destroy();
}

if ($_SESSION['droit'] == 1){
        if (isset($_POST) ){

        if ($_POST['titre'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'titre' non remplis"]);
        }
        elseif ($_POST['description'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'description' non remplis"]);
        }
        elseif ($_POST['salaire'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'salaire' non remplis"]);
        }
        elseif ($_POST['temps_travail'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'tempstravail' non remplis"]);
        }
        elseif ($_POST['job'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'job' non remplis"]);
        }
        elseif ($_POST['Id_Entreprise'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'Id_Entreprise' non remplis"]);
        }
        else{
            $insertAnnonce = new AnnonceModel();


            $inscripton = ($insertAnnonce->insertAnnonce($_POST['titre'], $_POST['description'] , $_POST['salaire'],$_POST['temps_travail'], $_POST['job'], $_POST['Id_Entreprise']));


            echo 1;            
            
        }
    }
    }
    else{
        session_destroy();
    }
}





elseif ($_POST['action'] == "deleteAnnonces"){

    //DELETE ANNONCE

if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
    session_destroy();
}

   if ($_SESSION['droit'] == 1){

    if (isset($_POST) ){

        if ($_POST['Id_Annonces'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'id' non remplis"]);
        }
        elseif($_POST["Id_Personne"] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'id' non remplis"]);
        }
        else{
            $insertAnnonce = new AnnonceModel();


            $inscripton = ($insertAnnonce->deleteByID($_POST['Id_Annonces']));


                // Vérifiez si l'anonnance a été suprimer avec succès
                if ($inscripton) {
                    echo 1;

                    $resultats = $insertAnnonce->searchByAll();
                    echo json_encode($resultats);
  


                    // Redirigez l'utilisateur vers une page de connexion ou autre
                } else {
                    echo 0;

                    // Affichez un message d'erreur à l'utilisateur
                }
            
            
        }
    }
   }
else{
    session_destroy();
}

}




elseif ($_POST['action'] == "updateAnnonces"){

     //UPDATE ANNONCE



   if ($_SESSION['droit'] == 1){

     if (isset($_POST) ){
        
        if ($_POST['Id_Annonces'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'id' non remplis"]);
        }
        elseif ($_POST['titre'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'titre' non remplis"]);
        }
        elseif ($_POST['description'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'description' non remplis"]);
        }
        elseif ($_POST['salaire'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'salaire' non remplis"]);
        }
        elseif ($_POST['temps_travail'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'temps_travail' non remplis"]);
        }
        elseif ($_POST['job'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'job' non remplis"]);
        }
        elseif ($_POST['Id_Entreprise'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'id_Entreprise' non remplis"]);
        }
        else{
            $insertAnnonce = new AnnonceModel();


            $inscripton = ($insertAnnonce->updateAnnonce($_POST['Id_Annonces'], $_POST['titre'], $_POST['description'] , $_POST['salaire'],$_POST['temps_travail'], $_POST['job'], $_POST['Id_Entreprise']));


                // Vérifiez si le compte a été créé avec succès
                echo 1;
            
            
        }
    }
 }
  else{
    session_destroy();
  }

}




    

?>



