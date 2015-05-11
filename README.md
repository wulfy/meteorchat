# meteorchat
Meteor tutorial : Chat based on meteor

-router.js
Déclare les routes et les templates associés
Souscris le client aux bonnes données publiées par le serveur selon le template associé
Initialise les données pour certains templates (comme room)

-Collection.js
Contient la déclaration des 2 bases de données mongoDB
Définit les fonctions serveur (méthodes et publication de données)

-home.js
Contient les fonctionnalités "client" comme la gestion des évènements utilisateur et la récupération des données (cf soucription/publication)

- home.html
contient tous les templates utilisés par l'appli (plus tard il faudrait éclater les templates en plusieurs fichiers différents pour plus de lisibilité)

- chatContainer.html
Template de base appelé par "router" comme layout de base.
utiliser la dénomination de template {{> yield}} pour afficher un template définit dans le router
