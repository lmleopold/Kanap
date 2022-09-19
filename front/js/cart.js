function retrieveBasket() {
    // récupère le panier du local storage
    const basketLinea = localStorage.getItem("basket");
    const basket = JSON.parse(basketLinea);
    for (let obj of basket) {
        obj.quantity = parseInt(obj.quantity, 10);
    }
    return basket;
}
// Récupération des infos produits
async function retrieveProductsData(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const product = await res.json();
        return {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            altTxt: product.altTxt,
        };
    } catch (err) {
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
}

function detailProductsData() {
    let basket;
    const productsData = {};
    if (localStorage.length > 0) {
        basket = retrieveBasket();
        for (product of basket) {
            const id = product.id;
            // console.log (id);
            async function detailData(id) {
                productsData[`_${id}`] = await retrieveProductsData(id);
                // console.table(productsData);
                // return productsData.id;
            }
            detailData(id);
        }
    } else {
        console.log("le panier est vide");
    }
    return productsData;
}

const productsData = detailProductsData();
console.log(productsData);
console.log(Object.entries(productsData));

// const article = document.getElementsByTagName("article");

for (const id in productsData){
    console.log("ok");
    console.log(`${id}: ${productsData[id]}`);}
    // $select.insertAdjacentHTML(
    // 'beforeend',
    //  `<option value =${color}>${color}</option>`
    // );
console.log('ok');

// const createItem = async
