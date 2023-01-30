// AFFICHE LES ARTICLES DU PANIER

/**
 * Se connecte à l'API Products et récupère le prix du produit ciblé par l'ID
 * @param {String} id ID récupéré via le local storage
 * @returns {Promise}
 * @returns {Promise.resolve.<Number>} product.price
 * @returns {Promise.reject.<Error>} Error
 */

async function optionsProductfromApi(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await res.json();
        return product.price;
    } catch (err) {
        console.error("Argh!\nUne erreur!\n\n" + err);
    }
}

/**
 * Récupère les données du panier stockées dans le local storage
 * Retourne un tableau contenant les articles sous forme d'objets
 * @returns {Object[]} basket
 * @returns {Object} product
 * @returns {String} product.id
 * @returns {String} product.color
 * @returns {Integer} product.quantity
 * @returns {String} product.name
 * @returns {String} product.imageUrl
 * @returns {String} product.description
 * @returns {String} product.altTxt
 */

function retrieveBasket() {
    let basket = [];
    if (localStorage.length > 0 && localStorage.getItem("basket") !== null) {
        basket = JSON.parse(localStorage.getItem("basket"));
    } else {
        document.querySelector("h1").innerText = "Votre panier \n est vide";
    }
    return basket;
}

/**
 * Recupere le contenu du panier: appelle retrieveBasket
 * Pour chaque article, consulte l'API Products (appelle optionsProductfromApi) pour récupérer le prix
 * Renvoi le panier en ajoutant le prix de chaque article
 * @returns {Promise}
 * @returns {Object[]} basket
 * @returns {Object} product
 * @returns {String} product.color
 * @returns {Integer} product.quantity
 * @returns {String} product.name
 * @returns {String} product.imageUrl
 * @returns {String} product.description
 * @returns {String} product.altTxt
 * @returns {Number} product.price
 */

async function basketAndPrice() {
    const basket = retrieveBasket();
    const pricePromises = basket.map(
        async (product) => await optionsProductfromApi(product.id)
    );
    const priceTab = await Promise.all(pricePromises);
    for (let i = 0; i < basket.length; i++) {
        basket[i].price = await priceTab[i];
    }
    return basket;
}

/**
 * Calcule le nombre total d'articles dans le panier et le prix total du panier
 * @returns {Promise.Object.<sumArtQuantity: Integer, totalPrice: Integer>}
 */

async function balanceOfBasket() {
    let sumArtQuantity = 0;
    let totalPrice = 0;
    const basketWithPrice = await basketAndPrice();

    for (const product of basketWithPrice) {
        product.quantity = parseInt(product.quantity, 10);
        product.price = parseInt(product.price, 10);

        sumArtQuantity += product.quantity;
        totalPrice += product.price * product.quantity;
    }
    return { sumArtQuantity, totalPrice };
}

/**
 * Récupère le panier avec les prix (appelle fonction basketAndPrice)
 * Ordonne les articles du panier selon l'ID
 * @returns
 * @returns {Promise}
 * @returns {Object[]} basketSorted
 * @returns {Object} product
 * @returns {String} product.color
 * @returns {Integer} product.quantity
 * @returns {String} product.name
 * @returns {String} product.imageUrl
 * @returns {String} product.description
 * @returns {String} product.altTxt
 * @returns {Number} product.price
 */

async function basketSort() {
    const basketWithPrice = await basketAndPrice();

    // Classement des éléments du panier
    const basketSorted = basketWithPrice.sort(function compare(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });
    return basketSorted;
}

// ALIMENTATION DU DOM

const $cartItems = document.getElementById("cart__items");

/**
 * Alimente le DOM à partir des articles présents dans le panier ordonné
 * Affiche le nombre total d'articles dans le panier et le prix total du panier
 */

async function domFeed() {
    // Efface l'affichage du panier dans le DOM
    while ($cartItems.firstChild) {
        $cartItems.removeChild($cartItems.firstChild);
    }
    // Récupère le panier ordonné par ID
    const basketSorted = await basketSort();
    // Pour chaque ligne du panier ajoute un item dans le DOM
    for (const product of basketSorted) {
        $cartItems.insertAdjacentHTML(
            "beforeend",
            `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
        );
    }
    // Affiche le nombre total d'articles dans le panier et le prix total du panier
    const balance = await balanceOfBasket();
    document.getElementById("totalPrice").innerText = balance.totalPrice;
    document.getElementById("totalQuantity").innerText = balance.sumArtQuantity;
}

/**
 * Attend que le DOM soit alimenté puis sur tous les input "itemQuantity":
 * - ajoute un Pattern sur pour limiter la saisie aux nombres
 * - ajoute un écouteur d'évènement "change". La fonction appelée:
 *  - récupère la quantité saisie en input et la convertie en "number"
 *  - recherche l'article correspondant dans le panier à partir des infos dataset id et color du DOM
 *  - met à jour la quantité dans le panier selon la valeur saisie en interdisant les valeurs <1
 * - sauvegarde le contenu du panier modifié (sans les prix) dans le local storage
 * - met à jour l'affichage du nombre total d'articles et du prix total du panier
 */
async function changeQuantity() {
    // Attend que le DOM soit alimenté puis sur tous les input "itemQuantity":
    await domFeed();
    // Récupère tous les input "itemQuantity" dans un tableau
    const inputsTab = Array.from(document.querySelectorAll(".itemQuantity"));
    // Sur tous les inputs
    for (const input of inputsTab) {
        // Ajoute un Pattern sur pour limiter la saisie aux nombres
        input.setAttribute("pattern", "[1-9]+");
        // Ajoute un écouteur d'évènement "change". La fonction appelée:
        input.addEventListener("change", async () => {
            const basket = retrieveBasket();
            // Récupère la quantité saisie en input et la convertie en "number"
            const newQuantity = parseInt(input.value, 10);
            // Recherche l'article correspondant dans le panier à partir des infos dataset id et color du DOM
            const pickedId = input.closest("article").dataset.id;
            const pickedColor = input.closest("article").dataset.color;
            // Met à jour la quantité dans le panier selon la valeur saisie en interdisant les valeurs <1
            function sameArticle(article) {
                return article.id === pickedId && article.color === pickedColor;
            }
            if (newQuantity < 1) {
                input.value = 1;
                basket.find(sameArticle).quantity = 1;
                window.alert(
                    "Veuillez saisir une quantité > 1 ou supprimez l'article"
                );
            } else {
                basket.find(sameArticle).quantity = newQuantity;
            }
            // Sauvegarde le contenu du panier modifié (sans les prix) dans le local storage
            localStorage.setItem("basket", JSON.stringify(basket));
            // Met à jour l'affichage du nombre total d'articles et du prix total du panier
            const balance = await balanceOfBasket();
            document.getElementById("totalPrice").innerText =
                balance.totalPrice;
            document.getElementById("totalQuantity").innerText =
                balance.sumArtQuantity;
        });
    }
}

/**
 * La fonction supprime l'article correspondant au bouton cliqué du DOM et du panier:
 * Recherche l'index de l'article à supprimer dans le panier à partir des infos dataset id et color du DOM
 * Supprime l'article du panier
 * Supprime le noeud HTML contenant le bouton cliqué
 * Sauvegarde le panier dans le local storage
 * Met à jour le nb d'articles et le prix affiché du panier *
 * @param {HTMLButtonElement} deleteButton
 */

async function deleteItem(deleteButton) {
    const basket = retrieveBasket();
    // Recherche l'article correspondant dans le panier à partir des infos dataset id et color du DOM
    const pickedId = deleteButton.closest("article").dataset.id;
    const pickedColor = deleteButton.closest("article").dataset.color;
    function sameArticle(article) {
        return article.id === pickedId && article.color === pickedColor;
    }
    const indexToDelete = basket.findIndex(sameArticle);
    // Supprime l'élément du panier
    basket.splice(indexToDelete, 1);
    // Supprime le noeud HTML contenant le bouton cliqué
    $cartItems.removeChild(deleteButton.closest("article"));
    document.querySelector("h1").innerText = "Votre panier \n est vide";
    // Sauvegarde le panier dans le local storage
    localStorage.setItem("basket", JSON.stringify(basket));
    // Met à jour le nb d'articles et le prix affiché du panier
    const balance = await balanceOfBasket();
    document.getElementById("totalPrice").innerText = balance.totalPrice;
    document.getElementById("totalQuantity").innerText = balance.sumArtQuantity;
}

/**
 * Appelle la fonction changeQuantity
 * Crée un écouteur d'évènement "click" sur chaque bouton "supprimer"
 * L'évènement appelle la fonction deleteItem qui supprime l'article du DOM et du Panier
 * S'auto-appelle au chargement de la page
 */

(async function deleteItemLoop() {
    await changeQuantity();
    // Crée un écouteur d'évènement "click" sur chaque bouton "supprimer"
    const deleteTab = Array.from(document.querySelectorAll(".deleteItem"));
    for (const deleteButton of deleteTab) {
        deleteButton.addEventListener(
            "click",
            // L'évènement appelle la fonction deleteItem qui supprime l'article du DOM et du Panier
            async () => await deleteItem(deleteButton)
        );
    }
    // S'auto-appelle au chargement de la page
})();

// GESTION DU FORMULAIRE D'IDENTIFICATION

// Récupération des noeuds html du formulaire dans un tableau d'Inputs
const $firstName = document.getElementById("firstName");
const $lastName = document.getElementById("lastName");
const $address = document.getElementById("address");
const $city = document.getElementById("city");
const $email = document.getElementById("email");
const formInputsTab = [$firstName, $lastName, $address, $city, $email];

// Affiche msg d'alerte si aucune info saisie
for (const input of formInputsTab) {
    if (input.value === "") {
        input.nextElementSibling.innerText = "*";
    }
}

// Création des expressions régulières pour les cases du formulaire
$firstName.setAttribute("pattern", "^[a-zA-Z-éèà-]+$");
$lastName.setAttribute("pattern", "^[a-zA-Z-éèà -]+$");
$address.setAttribute("pattern", "^([0-9]*) ?([a-zA-Z,-. ])+");
$city.setAttribute("pattern", "^[a-zA-Z-éèà -]+$");
$email.setAttribute(
    "pattern",
    "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)+(.[a-z]{2,4})+$"
);

/**
 * Crée un tableau InputisValid:
 * chaque case correspond à un input et reçoit le résultat du test de validité sous forme de valeur booleenne
 * Chaque Input du formulaire
 * - reçoit un écouteur d'évènement "change"
 * - La fonction appelée modifie et retourne le résultat du test de validité (false par défaut)
 */

const inputIsValid = [];
for (let i = 0; i < formInputsTab.length; i++) {
    inputIsValid[i] = false;
    formInputsTab[i].addEventListener("blur", function verifyUserInputs() {
        if (formInputsTab[i].checkValidity()) {
            // si le Pattern de l'Input est respecté le test est validé
            formInputsTab[i].nextElementSibling.innerText = ""; // pas de msg d'alerte
            inputIsValid[i] = true;
        } else if (formInputsTab[i] === "") {
            formInputsTab[i].nextElementSibling.innerText =
                "Veuillez remplir la case";
        } else {
            formInputsTab[i].nextElementSibling.innerText = "Saisie non valide";
        }
        return inputIsValid;
    });
}

/**
 * Crée une variable globale booléenne, InputsAreValid ("false" par défaut).
 * Compte le nb de tests valides dans le tableau InpuIsValid:
 * s'il correspond à la longueur du tableau, InputsAreValid devient "True"
 * @returns {Boolean} InputsAreValid
 */

function formInputsAreValid() {
    let inputsAreValid = true;
    inputIsValid.forEach((input) => (inputsAreValid = inputsAreValid && input));
    return inputsAreValid;
}

/**
 * Récupère le panier, extrait les ID, renvoi un tableau de tous les ID du panier sans doublons
 * @param {Object[]} basketWithPrice
 * @param {Object} product
 * @param {String} product.color
 * @param {Integer} product.quantity
 * @param {String} product.name
 * @param {String} product.imageUrl
 * @param {String} product.description
 * @param {String} product.altTxt
 * @param {Number} product.price
 * @returns {String[]} uniqueId
 * @returns {String} uniqueId[].Id
 */

function getId(basketWithPrice) {
    // récupère l'Id de chaque objet du panier
    const tabId = [basketWithPrice.map((product) => product.id)][0];
    // enlève les Id en doublon (canapés identique en 2 couleurs distinctes)
    const uniqueId = [...new Set(tabId)];
    // renvoi un tableau de tous les ID du panier sans doublons
    return uniqueId;
}

/**
 * Vérifie si les données du panier sont valides avant l'envoi de la commande:
 * - le tableau d'ID n'est pas vide
 * - les ID sont bien toutes au format "String"
 *
 * @param {Object[]} basketWithPrice
 * @param {Object} product
 * @param {String} product.color
 * @param {Integer} product.quantity
 * @param {String} product.name
 * @param {String} product.imageUrl
 * @param {String} product.description
 * @param {String} product.altTxt
 * @param {Number} product.price
 * @returns {String[]} uniqueId
 * @returns {String} uniqueId[].Id
 */

function getIdIsValid(basketWithPrice) {
    // Check le tableau d'ID n'est pas vide
    let getIdIsEmpty = true;
    if (getId(basketWithPrice).length > 0 && getId(basketWithPrice) !== null) {
        getIdIsEmpty = false;
    }
    // Check si les ID sont bien toutes au format "String"
    let idIsAString = true;
    getId(basketWithPrice).forEach((id) => {
        const typeId = typeof id;
        if (typeId !== "string") {
            idIsAString = false;
        }
        return idIsAString;
    });
    // Renvoi True si les 2 conditions sont ok
    if (!getIdIsEmpty && idIsAString) {
        return true;
    } else {
        return false;
    }
}

/**
 * Vérifie si les infos du formulaires d'dientification client sont valides
 * Vérifie si le tableau d'ID est valide et le panier n'est pas vide
 * Si oui:
 * - Envoi à l'API Products les données du formulaire:
 *  {Object.<firstName: String, lastName: String, address: String, city: String, email: String>}
 * - et le tableau des ID:
 *  {Array.<Id: String>}
 * - Récupère le numéro de commande envoyé par l'API et envoi vers une page
 *  de confimation contenant le numéro de commande dans l'URL
 */

document
    .querySelector(".cart__order__form__submit")
    .addEventListener("click", async function (e) {
        e.preventDefault();
        if (formInputsAreValid() === false) {
            window.alert("Veuillez vérifier les saisies dans le formulaire");
        } else if (getIdIsValid(await basketAndPrice()) === false) {
            window.alert(
                "Votre panier est vide: veuillez choisir au moins un article"
            );
        } else {
            const result = fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contact: {
                        firstName: $firstName.value,
                        lastName: $lastName.value,
                        address: $address.value,
                        city: $city.value,
                        email: $email.value,
                    },
                    products: getId(await basketAndPrice()),
                }),
            });
            result.then(async (answer) => {
                try {
                    const data = await answer.json();
                    window.location.href = `confirmation.html?id=${data.orderId}`;
                    localStorage.clear();
                } catch (err) {
                    console.error("Argh!\nUne erreur!\n\n" + err);
                }
            });
        }
    });
