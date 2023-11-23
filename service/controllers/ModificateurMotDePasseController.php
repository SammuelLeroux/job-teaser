<?php
require_once 'models/ModificationMotDePasseModel.php';

class ModificationMotDePasseController {
    public function modifierMotDePasse($email, $nouveauMotDePasse) {
        $modificationModel = new ModificationMotDePasseModel();

        if ($modificationModel->modifierMotDePasse($email, $nouveauMotDePasse)) {
            echo "Mot de passe modifié avec succès!";
            // Redirigez l'utilisateur vers une autre page ou affichez un message de réussite
        } else {
            echo "Erreur : l'email n'est pas associé à un utilisateur.";
            // Affichez un message d'erreur à l'utilisateur
        }
    }
}
?>
