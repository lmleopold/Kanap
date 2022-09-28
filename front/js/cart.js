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

// Gestion du formulaire

// Récupération des noeuds html du formulaire en Input
const $firstName = document.getElementById("firstName");
const $lastName = document.getElementById("lastName");
const $address = document.getElementById("address");
const $city = document.getElementById("city");
const $email = document.getElementById("email");

// Affiche msg si aucune info saisie
const userInputsTab = [$firstName, $lastName, $address, $city, $email];

for (const input of userInputsTab) {
    if (input.value == "") {
        console.log("vide");
        input.nextElementSibling.innerText = "Veuillez remplir la case";
    }
}

// Création des expressions régulières
const firstNameRegExp = new RegExp("^[a-zA-Z-éèà-]+$");
const lastNameRegexp = new RegExp("^[a-zA-Z-éèà -]+$");
const addressRegExp = new RegExp("^([0-9]*) ?([a-zA-Z,. ])+");
const cityNameRegexp = new RegExp("^[a-zA-Z-éèà -]+$");
const emailRegExp = new RegExp(
    "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)+(.[a-z]{2,4})+$"
);

const regExpTab = [
    firstNameRegExp,
    lastNameRegexp,
    addressRegExp,
    cityNameRegexp,
    emailRegExp,
];

let inputsIsValid = true;
function verifyUserInputs() {
for (let i = 0; i < userInputsTab.length; i++) {
        userInputsTab[i].addEventListener("change", function () {
            if (regExpTab[i].test(userInputsTab[i].value)) {
                userInputsTab[i].nextElementSibling.innerText = "";
            } else {
                userInputsTab[i].nextElementSibling.innerText =
                    "Saisie non valide";
                inputsIsValid = false;
            }
        });
    }
    return inputsIsValid;
}
verifyUserInputs();

function getId(basket) {
    // récupère l'Id de chaque objet du panier
    let tabId = [basket.map((product) => product.id)][0];
    // enlève les Id en doublon (canapés identique en 2 couleurs distinctes)
    let uniqueId = [...new Set(tabId)];
    return uniqueId;
}
getId(basket);

document
    .querySelector(".cart__order__form__submit")
    .addEventListener("click", function (e) {
        e.preventDefault();
        if (verifyUserInputs() == false) {
            console.alert("Veuillez vérifier les saisies du formulaire");
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
                    products: getId,
                }),
            });
            result.then(async (answer) => {
                try {
                    const data = await answer.json();
                    window.location.href = `confirmation.html?id=${data.orderId}`;
                    localStorage.clear();
                } catch (e) {}
            });
        }
    });

// const firstNamePattern = $firstName.setAttribute("pattern", "[a-zA-Z-éèà]*");
// const lastNamePattern = $lastName.setAttribute("pattern", "[a-zA-Z-éèà]*");
// let patternCity = $city.setAttribute("pattern", "[a-zA-Z-éèà]*");

//   let response = await fetch('/article/fetch/post/user', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(user)
//   });

//   let result = await response.json();
//   alert(result.message);
