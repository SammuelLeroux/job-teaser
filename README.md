# Job Teaser Project

## Introduction
Bienvenue dans le projet Job Teaser ! Ce projet utilise PHP en backend sans framework et React en frontend pour créer une application web interactive. Ce README vous guidera à travers le processus d'installation et de configuration, même si vous n'avez pas encore installé PHP, Composer, ou les outils nécessaires pour lancer une application React.

## Installation

### Prérequis
Assurez-vous d'avoir les éléments suivants installés sur votre machine avant de commencer :
- [PHP](https://www.php.net/manual/en/install.php)
- [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Étapes d'installation

1. Clonez le repository :
    ```bash
    git clone https://github.com/SammuelLeroux/job-teaser.git
    cd job-teaser
    ```

2. Installation des dépendances backend (PHP) :
    ```bash
    cd service
    composer install
    ```

3. Installation des dépendances frontend (React) :
    ```bash
    cd ../client
    npm install
    ```

## Configuration

### Configuration Backend (PHP)

1. Copiez le fichier `.env.example` et renommez-le en `.env` :
    ```bash
    cp .env.example .env
    ```

2. Modifiez le fichier `.env` avec vos paramètres de base de données et d'autres configurations nécessaires.

### Configuration Frontend (React)

1. Créez un fichier `.env` dans le dossier `client` et ajoutez la variable d'environnement suivante :
    ```
    REACT_APP_API_URL=http://localhost:3000
    ```
   Assurez-vous que l'URL correspond à l'URL où votre backend est en cours d'exécution.

## Lancement de l'application

### Backend (PHP)

Dans le dossier `service`, exécutez la commande suivante :
```bash
php -S localhost:3000 -t public
```

### Frontend (React)

Dans le dossier client, exécutez la commande suivante :
```
npm start
```
L'application sera accessible à l'adresse http://localhost:3000 dans votre navigateur.

