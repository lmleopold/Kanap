// Récupération de l'ID du produit à afficher via l'URL

const str = window.location.href;
const url = new URL(str);
const searchParams = new URLSearchParams(url.search);
let Id;
if (searchParams.has('Id')) {
    Id = searchParams.get('Id');
} else {
    console.log("aucun Id n'a été trouvé pour la page");
};

// Connexion à l'API et récupération des data via l'ID

const retrieveProductsData = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${Id}`);
        return await res.json();
    } catch (err) {
        console.alert('Argh!\nUne erreur!\n\n' + err);
    }
};

// Récupération des infos produits

const detailProductData = async () => {
    const product = await retrieveProductsData();
    return {
        detailsProduct: product,
        colors: product.colors,
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        altTxt: product.altTxt,
    };
};

// Remplissage de la page produit

const fillProductPage = async () => {
    const product = await detailProductData();

    const $item__img = document.querySelector('.item__img');
    const $title = document.getElementById('title');
    const $price = document.getElementById('price');
    const $description = document.getElementById('description');
    const $select = document.querySelector('select');

    const $img = document.createElement('img');
    $img.src = await product.imageUrl;
    $img.alt = await product.altTxt;
    $item__img.appendChild($img);

    $title.innerText = await product.name;
    $price.innerText = await product.price;
    $description.innerText = await product.description;
    for (let color of await product.colors){
        $select.insertAdjacentHTML(
            'beforeend',
            `<option value =${color}>${color}</option>`
        );
    }

};
fillProductPage();
