// Récupération de l'ID du produit à afficher via l'URL

const str = window.location.href;
const url = new URL(str);
const searchParams = new URLSearchParams(url.search);
let id;
if (searchParams.has("Id")) {
    id = searchParams.get("Id");
} else {
    console.log("aucun Id n'a été trouvé pour la page");
}

// Connexion à l'API et récupération des data via l'ID

async function optionsProductfromApi (id) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
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
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
};


// Remplissage de la page produit

const fillProductPage = async () => {
    const product = await optionsProductfromApi(id);

    const $item__img = document.querySelector(".item__img");
    const $title = document.getElementById("title");
    const $price = document.getElementById("price");
    const $description = document.getElementById("description");
    const $select = document.querySelector("select");

    const $img = document.createElement("img");
    $img.src = await product.imageUrl;
    $img.alt = await product.altTxt;
    $item__img.appendChild($img);

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

// Gestion du panier///////////////////////////////

function updateBasket(id, color, quantity) {
    // Récupère le panier existant sur le local storage ou en crée un nouveau
    if (localStorage.length > 0 && localStorage.getItem("basket") !== null) {
        const basket = JSON.parse(localStorage.getItem("basket"));
        verifyUserInputs(id, color, quantity, basket);
    } else {
        const basket = [];
        verifyUserInputs(id, color, quantity, basket);
    }
}

function verifyUserInputs(id, color, quantity, basket) {
    if (color === "") {
        window.alert("Veuillez d'abord choisir une couleur");
    } else if (quantity < 1) {
        window.alert("Le nombre d'articles doit être au moins égal à 1");
    } else {
        addArtToBasket(id, color, quantity, basket);
    }
}

async function createNewArticle(id, color, quantity) {
    // création d'un nouvel article
    const product = await optionsProductfromApi(id);
    const newArticle = {
        id,
        color,
        quantity,
        name: product.name,
        // price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        altTxt: product.altTxt,
    };
    return newArticle;
}

function saveBasket(basket) {
    // sauvegarde du panier sur le local storage
    const basketLinea = JSON.stringify(basket);
    localStorage.setItem("basket", basketLinea);
    console.log("Voici le contenu de votre panier:");
    basket.forEach((e) => console.log(e));
}

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
    saveBasket(basket);
    // window.alert("Votre article a été ajouté au panier");
}

document.getElementById("addToCart").addEventListener("click", () => {
    const colorArticle = document.getElementById("colors").value;
    const nbArticles = parseInt(document.getElementById("quantity").value, 10);
    updateBasket(id, colorArticle, nbArticles);
});
