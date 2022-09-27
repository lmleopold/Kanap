// récupère le panier du local storage

let basket = [];
if (localStorage.length > 0 && localStorage.getItem("basket") !== null) {
    basket = JSON.parse(localStorage.getItem("basket"));
    console.log("basket: ", basket);
} else {
    console.log("le panier est vide");
    document.querySelector("h1").innerText = "Votre panier \n est vide";
}

const $cartItems = document.getElementById("cart__items");

// Calcul du nombre total d'articles dans le panier et du prix total du panier
function balanceOfBasket() {
    let sumArtQuantity = 0;
    let totalPrice = 0;

    for (const product of basket) {
        product.quantity = parseInt(product.quantity, 10);
        product.price = parseInt(product.price, 10);

        sumArtQuantity += product.quantity;
        totalPrice += product.price * product.quantity;
    }
    return { sumArtQuantity, totalPrice };
}

// Alimentation du DOM
function domFeed() {
    // Efface l'affichage du panier dans le DOM
    while ($cartItems.firstChild) {
        $cartItems.removeChild($cartItems.firstChild);
    }

    for (const product of basket) {
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
                        <p>$${product.price} €</p>
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
    const balance = balanceOfBasket();
    document.getElementById("totalPrice").innerText = balance.totalPrice;
    document.getElementById("totalQuantity").innerText = balance.sumArtQuantity;
}

domFeed();

const inputsTab = Array.from(document.querySelectorAll(".itemQuantity"));

function changeQuantity() {
    for (const input of inputsTab) {
        input.addEventListener("change", function () {
            let newQuantity = parseInt(input.value, 10);

            let pickedId = input.closest("article").dataset.id;
            let pickedColor = input.closest("article").dataset.color;

            function sameArticle(article) {
                return article.id === pickedId && article.color === pickedColor;
            }

            basket.find(sameArticle).quantity = newQuantity;

            localStorage.setItem("basket", JSON.stringify(basket));

            const balance = balanceOfBasket();
            document.getElementById("totalPrice").innerText =
                balance.totalPrice;
            document.getElementById("totalQuantity").innerText =
                balance.sumArtQuantity;
        });
    }
}

changeQuantity();

const deleteTab = Array.from(document.querySelectorAll(".deleteItem"));

function deleteItem() {
    console.log("ok");
    for (const deleteButton of deleteTab) {
        deleteButton.addEventListener("click", function () {
            // On récupère la ligne du panier contenant l'élément à supprimer
            let pickedId = deleteButton.closest("article").dataset.id;
            let pickedColor = deleteButton.closest("article").dataset.color;
            function sameArticle(article) {
                return article.id === pickedId && article.color === pickedColor;
            }
            const indexToDelete = basket.findIndex(sameArticle);
            // on supprime l'élément du panier
            const deleteElt = basket.splice(indexToDelete, 1);
            // console.log("basket:", basket, "delete:", deleteElt);

            // On supprime le noeud HTML contenant le bouton cliqué
            $cartItems.removeChild(deleteButton.closest("article"));
            // On met à jour le panier dans le local storage
            localStorage.setItem("basket", JSON.stringify(basket));
            // On met à jour le nb d'articles et le prix affiché du panier
            const balance = balanceOfBasket();
            document.getElementById("totalPrice").innerText =
                balance.totalPrice;
            document.getElementById("totalQuantity").innerText =
                balance.sumArtQuantity;
        });
    }
}

deleteItem();
