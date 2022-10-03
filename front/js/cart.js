async function optionsProductfromApi(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await res.json();
        // Récupération des infos produits
        return product.price;
    } catch (err) {
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
}

function retrieveBasket() {
    let basket = [];
    if (localStorage.length > 0 && localStorage.getItem("basket") !== null) {
        basket = JSON.parse(localStorage.getItem("basket"));

        // console.table(optionsProduct);
        console.log("basket: ", basket);
    } else {
        console.log("le panier est vide");
        document.querySelector("h1").innerText = "Votre panier \n est vide";
    }
    return basket;
}

async function basketWithPrice() {
    const basket = retrieveBasket();
    const pricePromises = basket.map(
        async (product) => await optionsProductfromApi(product.id)
    );
    const priceTab = await Promise.all(pricePromises);
    for (let i = 0; i < basket.length; i++) {
        basket[i].price = await priceTab[i];
        console.table(basket[i]);
    }
    console.table(basket);
    return basket;
}

const $cartItems = document.getElementById("cart__items");

// Calcul du nombre total d'articles dans le panier et du prix total du panier
async function balanceOfBasket() {
    let sumArtQuantity = 0;
    let totalPrice = 0;
    const basket = await basketWithPrice();

    for (const product of basket) {
        product.quantity = parseInt(product.quantity, 10);
        product.price = parseInt(product.price, 10);

        sumArtQuantity += product.quantity;
        totalPrice += product.price * product.quantity;
    }
    return { sumArtQuantity, totalPrice };
}

async function basketSort() {
    const basket = await basketWithPrice();

    // Classement des éléments du panier
    const basketSorted = basket.sort(function compare(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });
    return basketSorted
}

// Alimentation du DOM
async function domFeed() {
    // Efface l'affichage du panier dans le DOM
    while ($cartItems.firstChild) {
        $cartItems.removeChild($cartItems.firstChild);
    }

    const basket = await basketSort();

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
    const balance = await balanceOfBasket();
    document.getElementById("totalPrice").innerText = balance.totalPrice;
    document.getElementById("totalQuantity").innerText = balance.sumArtQuantity;
}

async function changeQuantity() {
    await domFeed();
    const inputsTab = Array.from(document.querySelectorAll(".itemQuantity"));
    for (const input of inputsTab) {
        input.setAttribute("pattern", "[1-9]+");
        input.addEventListener("change", async () => {
            const basket = await basketWithPrice();
            const newQuantity = parseInt(input.value, 10);

            const pickedId = input.closest("article").dataset.id;
            const pickedColor = input.closest("article").dataset.color;

            function sameArticle(article) {
                return article.id === pickedId && article.color === pickedColor;
            }
            if (newQuantity < 1) {
                basket.find(sameArticle).quantity = 1;
            }
            basket.find(sameArticle).quantity = newQuantity;

            localStorage.setItem("basket", JSON.stringify(basket));

            const balance = await balanceOfBasket();
            document.getElementById("totalPrice").innerText =
                balance.totalPrice;
            document.getElementById("totalQuantity").innerText =
                balance.sumArtQuantity;
        });
    }
}

async function deleteItem(deleteButton) {
    const basket = await basketWithPrice();
    console.log(deleteButton);
    // On récupère la ligne du panier contenant l'élément à supprimer
    const pickedId = deleteButton.closest("article").dataset.id;
    const pickedColor = deleteButton.closest("article").dataset.color;
    function sameArticle(article) {
        return article.id === pickedId && article.color === pickedColor;
    }
    const indexToDelete = basket.findIndex(sameArticle);
    // on supprime l'élément du panier
    basket.splice(indexToDelete, 1);
    // console.log("basket:", basket, "delete:", deleteElt);

    // On supprime le noeud HTML contenant le bouton cliqué
    $cartItems.removeChild(deleteButton.closest("article"));
    // On met à jour le panier dans le local storage
    localStorage.setItem("basket", JSON.stringify(basket));
    // On met à jour le nb d'articles et le prix affiché du panier
    const balance = await balanceOfBasket();
    document.getElementById("totalPrice").innerText = balance.totalPrice;
    document.getElementById("totalQuantity").innerText = balance.sumArtQuantity;
}
(async function deleteItemLoop() {
    await changeQuantity();
    const deleteTab = Array.from(document.querySelectorAll(".deleteItem"));
    for (const deleteButton of deleteTab) {
        deleteButton.addEventListener(
            "click",
            async () => await deleteItem(deleteButton)
        );
        // addEventListener("click", deleteItem(deleteButton));
        const nbArticles = parseInt(
            deleteButton.closest("article").querySelector(".itemQuantity")
                .value,
            10
        );
        if (nbArticles < 1) {
            deleteItem(deleteButton);
        }
    }
})();

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
        input.nextElementSibling.innerText = "Veuillez remplir la case";
    }
}

// Création des expressions régulières
$firstName.setAttribute("pattern", "^[a-zA-Z-éèà-]+$");
$lastName.setAttribute("pattern", "^[a-zA-Z-éèà -]+$");
$address.setAttribute("pattern", "^([0-9]*) ?([a-zA-Z,-. ])+");
$city.setAttribute("pattern", "^[a-zA-Z-éèà -]+$");
$email.setAttribute(
    "pattern",
    "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)+(.[a-z]{2,4})+$"
);

const inputIsValid = [];
for (let i = 0; i < userInputsTab.length; i++) {
    inputIsValid[i] = false;
    userInputsTab[i].addEventListener("change", function verifyUserInputs() {
        if (userInputsTab[i].checkValidity()) {
            userInputsTab[i].nextElementSibling.innerText = "";
            inputIsValid[i] = true;
        } else if (userInputsTab[i] === "") {
            userInputsTab[i].nextElementSibling.innerText =
                "Veuillez remplir la case";
        } else {
            userInputsTab[i].nextElementSibling.innerText = "Saisie non valide";
        }
        return inputIsValid;
    });
}

function checkInputsValidity() {
    let InputsAreValid = false;
    let nbInputsValid = 0;
    for (let i = 0; i < userInputsTab.length; i++) {
        if (inputIsValid[i]) {
            nbInputsValid++;
        }
    }
    if (nbInputsValid === userInputsTab.length) {
        InputsAreValid = true;
    }
    return InputsAreValid;
}

function getId(basket) {
    // récupère l'Id de chaque objet du panier
    const tabId = [basket.map((product) => product.id)][0];
    // enlève les Id en doublon (canapés identique en 2 couleurs distinctes)
    const uniqueId = [...new Set(tabId)];
    return uniqueId;
}

function getIdIsValid(basket) {
    let getIdIsEmpty = true;
    if (getId(basket).length > 0 && getId(basket) !== null) {
        getIdIsEmpty = false;
    }
    let idIsAString = true;
    getId(basket).forEach((id) => {
        const typeId = typeof id;
        if (typeId !== "string") {
            idIsAString = false;
        }
        return idIsAString;
    });

    if (getIdIsEmpty === false && idIsAString === true) {
        return true;
    } else {
        return false;
    }
}

document
    .querySelector(".cart__order__form__submit")
    .addEventListener("click", async function (e) {
        e.preventDefault();
        if (checkInputsValidity() === false) {
            window.alert("Veuillez vérifier les saisies dans le formulaire");
        } else if (getIdIsValid(await basketWithPrice()) === false) {
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
                    products: getId(await basketWithPrice()),
                }),
            });
            result.then(async (answer) => {
                try {
                    const data = await answer.json();
                    window.location.href = `confirmation.html?id=${data.orderId}`;
                    localStorage.clear();
                } catch (err) {
                    console.alert("Argh!\nUne erreur!\n\n" + err);
                }
            });
        }
    });
