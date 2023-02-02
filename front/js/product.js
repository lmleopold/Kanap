// GESTION DE L'AFFICHAGE DES DONNEES DU PRODUIT

// Récupère l'ID du produit à afficher via l'URL

const str = window.location.href;
const url = new URL(str);
const searchParams = new URLSearchParams(url.search);
let id;
if (searchParams.has("Id")) {
    id = searchParams.get("Id");
} else {
    console.log("aucun Id n'a été trouvé pour la page");
}

/**
 * Se connecte à l'API Products et récupère le détail des options du produit ciblé par l'ID
 * @param {String} id ID récupéré via l'URL
 * @returns {Promise}
 * @returns {Promise.resolve.Object.<colors: String[], id: String, name: String, price: Number, imageUrl:String, description: String, altTxt: String>}
 * @returns {Promise.reject.<Error>} Error
 */

async function optionsProductfromApi(id) {
    try {
        const res = await fetch(
            `https://kanap-backend2.onrender.com/api/products/${id}`
        );
        const product = await res.json();
        // Récupération des infos produits
        return {
            colors: product.colors,
            id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
            altTxt: product.altTxt,
        };
    } catch (err) {
        console.log("Argh!\nUne erreur!\n\n" + err);
    }
}

/**
 * Appelle la fonction optionsProductfromApi pour récupérer les options du produit
 * Remplit la page produit à partir du détail des options
 */

const fillProductPage = async () => {
    const product = await optionsProductfromApi(id);

    const $itemImg = document.querySelector(".item__img");
    const $title = document.getElementById("title");
    const $price = document.getElementById("price");
    const $description = document.getElementById("description");
    const $select = document.querySelector("select");

    const $img = document.createElement("img");
    $img.src = await product.imageUrl;
    $img.alt = await product.altTxt;
    $itemImg.appendChild($img);

    $title.innerText = await product.name;
    $price.innerText = await product.price;
    $description.innerText = await product.description;
    for (const color of await product.colors) {
        $select.insertAdjacentHTML(
            "beforeend",
            `<option value =${color}>${color}</option>`
        );
    }
};
fillProductPage();

// GESTION DU PANIER

/**
 * Récupère le panier existant sur le local storage ou en crée un nouveau
 * Vérifie la validité des données saisies dans la page produit: appelle verifyUserInputs
 * @param {String} id ID récupéré via l'URL
 * @param {String} color Couleur choisie par le client
 * @param {Integer} quantity Quantité choisie par le client
 * @returns {Function (id:String, color:String, quantity: String, basket: Object[])} verifyUserInputs
 */

function updateBasket(id, color, quantity) {
    let basket;
    if (localStorage.length > 0 && localStorage.getItem("basket") !== null) {
        basket = JSON.parse(localStorage.getItem("basket"));
    } else {
        basket = [];
    }
    return verifyUserInputs(id, color, quantity, basket);
}

/**
 * Vérifie si les informations saisies par le client en page produit sont valides:
 * - si une couleur a été choisie
 * - si le nombre d'articles est supérieure à 0
 * Si oui ajoute l'article au panier (appelle addArtToBasket)
 * @param {String} id ID récupéré via l'URL
 * @param {String} color Couleur choisie par le client
 * @param {Integer} quantity Quantité choisie par le client
 * @param {Object[] | Array.<{id: String, name: String, imageUrl:String, description: String, altTxt: String}} basket
 * Tabeau vide ou tableau d'objets si le panier contient des articles
 * @returns {window.alert | Function (id:String, color:String, quantity:String, basket: Object[])} window.alert | addArtToBasket
 */

function verifyUserInputs(id, color, quantity, basket) {
    if (color === "") {
        return window.alert("Veuillez d'abord choisir une couleur");
    } else if (quantity < 1) {
        return window.alert("Le nombre d'articles doit être au moins égal à 1");
    } else {
        return addArtToBasket(id, color, quantity, basket);
    }
}

/**
 * Renvoie un objet "nouvel article" comprenant:
 * - des caractéristiques saisies par le client en page produit (id, color, quantity)
 * - des options du produit founies par l'API Product (name, imageUrl, description, altTxt)
 * @param {String} id
 * @param {String} color
 * @param {Integer} quantity
 * @returns {Object.<id: String, color: String, quantity: Integer, name: String, imageUrl: String, description: String, altTxt: String} newArticle
 */

async function createNewArticle(id, color, quantity) {
    const product = await optionsProductfromApi(id);
    const newArticle = {
        id,
        color,
        quantity,
        name: product.name,
        imageUrl: product.imageUrl,
        description: product.description,
        altTxt: product.altTxt,
    };
    return newArticle;
}

/**
 * Sauvegarde le panier sur le local storage:
 * le panier contient toutes les informations sur l'article sauf le prix
 * @param {Object[]} basket
 */

function saveBasket(basket) {
    const basketLinea = JSON.stringify(basket);
    localStorage.setItem("basket", basketLinea);
}

/**
 * Appelle la fonction createNewArticle pour créer un nouvel article
 * Regarde s'il existe déjà un article dans le panier avec même ID + même color:
 * - si oui: met à jour la quantité
 * - si non: ajoute l'article au panier (sans le prix)
 * Appelle la fonction saveBasket pour sauvegarder le panier sur le local storage
 * @param {String} id
 * @param {String} color
 * @param {Integer} quantity
 * @param {Object[]} basket
 */

async function addArtToBasket(id, color, quantity, basket) {
    // ajoute un nouvel article au panier:
    const newArticle = await createNewArticle(id, color, quantity);
    if (basket.length > 0) {
        const duplicate = basket.find((e) => e.id === id && e.color === color);
        if (duplicate !== undefined) {
            duplicate.quantity = duplicate.quantity + quantity;
        } else {
            basket.push(newArticle);
        }
    } else {
        basket.push(newArticle);
    }
    saveBasket(basket); // sauvegarde le panier sur le local storage
}

/**
 * Ajoute un écouteur d'évènement sur le bouton "commander":
 * Au "click" :
 * - récupère la couleur choisie par le client
 * - récupère le quantité saisie (au format String) et la converti au format Number
 * - Appelle la fonction "updateBasket" pour mettre à jour le panier
 */
document.getElementById("addToCart").addEventListener("click", () => {
    const color = document.getElementById("colors").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    updateBasket(id, color, quantity);
});
