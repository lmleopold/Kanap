// récupère le panier du local storage
const basket = JSON.parse(localStorage.getItem("basket"));
if (localStorage.length === 0) {
    console.log("le panier est vide");
} else {
    console.log("basket: ", basket);
}

// Récupération des infos produits
async function retrieveProductsData(artId) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${artId}`);
        const product = await res.json();
        return {
            artName: product.name,
            artPrice: product.price,
            artImageUrl: product.imageUrl,
            artltTxt: product.altTxt,
        };
    } catch (err) {
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
}

const $cart__items = document.getElementById("cart__items");
const productsData = {};
let sumArtQuantity = 0;
let totalPrice = 0;

// Classement des éléments du panier
// basket.sort(function compare(a, b) {
//     if (a.id < b.id) return -1;
//     if (a.id > b.id) return 1;
//     return 0;
// });
// console.log("basket: ", basket);

// Alimentation du DOM
for (product of basket) {
    const artId = product.id;
    const artColor = product.color;
    const artQuantity = product.quantity;
    sumArtQuantity += artQuantity;

    retrieveProductsData(artId)
        .then((result) => {
            productsData[artId] = result;
            // console.log(productsData[artId]);
            totalPrice += productsData[artId].artPrice * artQuantity;
            // console.log(totalPrice);
            $cart__items.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="{artId}" data-color="{product-color}">
        <div class="cart__item__img">
        <img src="${productsData[artId].artImageUrl}" alt="${productsData[artId].artltTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
        <h2>${productsData[artId].artName}</h2>
        <p>${artColor}</p>
        <p>$${productsData[artId].artPrice} €</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${artQuantity}">
        </div>
        <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
        </div>
        </div>
        </div>
        </article>`
            );
            return totalPrice;
        })
        .then(
            (totalPrice) =>
                (document.getElementById("totalPrice").innerText = totalPrice)
        );
}

document.getElementById("totalQuantity").innerText = sumArtQuantity;
