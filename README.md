# meteorchat
Meteor tutorial : Chat based on meteor

Chat permettant de mettre en application
- le package "iron-router" (https://github.com/iron-meteor/iron-router) permettant de définir des routes et les associer à des templates
- la gestion et l'incusion de templates
- la gestion d'utilisateurs (+droits associés)
- La notion de publication/souscription permettant de maitriser les données partagées avec le client
- La protection des fonctionnalités critiques en les executant uniquement côté serveur
- La gestion d'events et helpers

## router.js
Déclare les routes et les templates associés
Souscris le client aux bonnes données publiées par le serveur selon le template associé
Initialise les données pour certains templates (comme room)

## Collection.js
Contient la déclaration des 2 bases de données mongoDB
Définit les fonctions serveur (méthodes et publication de données)

## home.js
Contient les fonctionnalités "client" comme la gestion des évènements utilisateur et la récupération des données (cf soucription/publication)

## home.html
contient tous les templates utilisés par l'appli (plus tard il faudrait éclater les templates en plusieurs fichiers différents pour plus de lisibilité)

## chatContainer.html
Template de base appelé par "router" comme layout de base.
utiliser la dénomination de template {{> yield}} pour afficher un template définit dans le router
