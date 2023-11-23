<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');


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

//Insert Personne
if ($_POST['action'] == "creation_compte") {





    if (isset($_POST) ){

        if ($_POST['nom'] == "null"){
            echo "0";
            echo "Erreur champ 'nom' non remplis";
        }
        elseif ($_POST['prenom'] == "null"){
            echo "0";
            echo "Erreur champ 'prenom' non remplis";
        }
        elseif ($_POST['mdp'] == "null"){
            echo "0";
            echo "Erreur champ 'mdp' non remplis";
        }
        elseif ($_POST['date_naissance'] == "null"){
            echo "0";
            echo "Erreur champ 'date de naissance' non remplis";
        }
        elseif ($_POST['email'] == "null"){
            echo "0";
            echo "Erreur champ 'email' non remplis";
        }
        elseif ($_POST['telephone'] == "null"){
            echo "0";
            echo "Erreur champ 'telephone' non remplis";
        }
        else{
            $inscriptionModel = new PersonneModel();

            $verifemail = $inscriptionModel->verifierEmailUnique($_POST['email']);
            $verifmdp = $inscriptionModel->verifierForceMotDePasse($_POST['mdp']);


            if ($verifemail == true){
                
                if ($verifmdp == true){

                    $droit = 0;

                    if (isset($_SESSION)){
                        $droit = 1;
                    }


                    $inscriptionModel->creerCompte($_POST['nom'], $_POST['prenom'], $_POST['mdp'], $_POST['date_naissance'], $_POST['email'] , $_POST['telephone'], $droit);
                    echo 1;
                    
                } 
                else{ echo 0; }
            
            }   
        }
    }
}

//READ//
elseif ($_POST['action'] == "connexion"){

    // if ($_SESSION['Id_Personne'] != $_POST['Id_Personne']){
    //     session_destroy();
    // }




$resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new PersonneModel();
            $resultats = $allModel->searchByEmail($_POST['email'], $_POST['mdp']);
            
        }




        if ($resultats){
            if (count($resultats) > 0 ){
            // Convertir les résultats en JSON
            $jsonResultats = json_encode($resultats);
        
            // Envoyer les résultats en tant que réponse JSON
            header('Content-Type: application/json');
            echo 1;
            echo $jsonResultats;

            session_start();
            $_SESSION = $resultats;

        }
        else {
            echo 0;
        }
        }
        else {
            echo 0;
        }
        
    }

    elseif ($_POST['action'] == "afficherPersonne"){

        if ($_SESSION['Id_Personne'] != $_POST['Id_Session']){
            session_destroy();
        }
    
    
    
            $resultats = [];
    
    
            if (isset($_POST) ){
                
               
                $allModel = new PersonneModel();
                $resultats = $allModel->searchByAll();
                
            }
    
    
    
    
            
            // Convertir les résultats en JSON
            $jsonResultats = json_encode($resultats);
        
            // Envoyer les résultats en tant que réponse JSON
            header('Content-Type: application/json');
            echo $jsonResultats;
        }

  
  //DELETE//
    elseif ($_POST['action'] == "deletePersonne"){

        if ($_SESSION['Id_Personne'] != $_POST['Id_Session']){
            session_destroy();
        }

        if ($_SESSION['droit'] != 1){
            session_destroy();
        }



$resultats = [];


        if (isset($_POST) ){
            
           
            $allModel = new PersonneModel();
            $resultat = $allModel->deleteById($_POST['Id_Personne']);
            
        }




        if ($resultat) {
            echo 1;

            $resultat = $allModel->searchByAll();
            echo json_encode($resultat);



            // Redirigez l'utilisateur vers une page de connexion ou autre
        } else {
            echo 0;

            // Affichez un message d'erreur à l'utilisateur
        }
    
    }

   
   //UPDATE Personne

    elseif ($_POST['action'] == 'updatePersonne'){


        if ($_SESSION['droit'] != 1){
            session_destroy();
        }

     if (isset($_POST) ){
        
        if ($_POST['Id_Personne'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'Id_Personne' non remplis"]);
        }
        elseif ($_POST['nom'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'nom' non remplis"]);
        }
        elseif ($_POST['prenom'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'prenom' non remplis"]);
        }
        elseif ($_POST['mdp'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'mdp' non remplis"]);
        }
        elseif ($_POST['date_naissance'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'date_naissance' non remplis"]);
        }
        elseif ($_POST['email'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'email' non remplis"]);
        }
        elseif ($_POST['telephone'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'telephone' non remplis"]);
        }
        elseif ($_POST['droit'] == "null"){
            echo "0";
            echo json_encode(["Erreur champ 'droit' non remplis"]);
        }
        else{
            $udatePersonne = new PersonneModel();


            $inscripton = ($udatePersonne->updatePersonne($_POST['Id_Personne'], $_POST['nom'], $_POST['prenom'] , $_POST['mdp'],$_POST['date_naissance'], $_POST['email'], $_POST['telephone'], $_POST['droit']));


                // Vérifiez si le compte a été créé avec succès
                if ($inscripton) {
                    echo 1;
                    echo json_encode(["Compte créé avec succès!"]);
                    // Redirigez l'utilisateur vers une page de connexion ou autre
                } else {
                    echo 0;
                     echo json_encode(["Erreur : l'email n'est pas unique ou une autre erreur s'est produite."]);
                    // Affichez un message d'erreur à l'utilisateur
                }
            
            
        }
    }
}

elseif ($_POST['action'] == "modifierMotDePasse"){
    if ($_SESSION['Id_Personne'] != $_POST['Id_Session']){
        session_destroy();
    }

    if ($_POST["email"] == "null"){
        echo "0";
            echo json_encode(["Erreur champ 'email' non remplis"]);
    }
    else{
        $modifierMotDePasse = new PersonneModel();

    }
}

?>
