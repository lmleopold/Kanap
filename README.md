# Kanap: Projet 5 du parcours Développeur web d'OpenClassrooms : Construisez un site e-commerce en JavaScript Vanilla #

## Objectif du projet ##

Réalisation de la partie front-end Javascript du site e-commerce Kanap (marque de canapés)

### Spécifications fonctionnelles ###

L’application web est composée de 4 pages dont les fonctionnalités suivantes doivent êtres codées en Javascript :

* Une page d’accueil montrant (de manière dynamique) tous les articles disponibles à
la vente.

* Une page “produit” qui affiche (de manière dynamique) les détails du produit sur
lequel l'utilisateur a cliqué depuis la page d’accueil. Depuis cette page, l’utilisateur
peut sélectionner une quantité, une couleur, et ajouter le produit à son panier.

* Une page “panier”. Celle-ci contient plusieurs parties :
  * Un résumé des produits dans le panier, le prix total et la possibilité de
    modifier la quantité d’un produit sélectionné ou bien de supprimer celui-ci.
  * Un formulaire permettant de passer une commande. Les données du
    formulaire doivent être correctes et bien formatées avant d'être renvoyées au
    back-end. Par exemple, pas de chiffre dans un champ prénom.
    
* Une page “confirmation” :
  Un message de confirmation de commande, remerciant l'utilisateur pour sa
    commande, et indiquant l'identifiant de commande envoyé par l’API.

### Back end Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Back end Installation ###

Clone this repo. From the "back" folder of the project, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.



