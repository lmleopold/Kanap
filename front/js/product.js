// Connexion à l'API

const retrieveProductsData = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        return await res.json();
    } catch (err) {
        console.alert('Argh!\nUne erreur!\n\n' + err);
    }
};

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

// Récupération des infos produits via l'Id 

const detailProductData = async () => {
    const productData = await retrieveProductsData();
    let product = {};
    function choseProduct() {
        if (productData[i]._id === Id) {
            product = productData[i];
            i = productData.length;
        }
    }
    let i=0;
    while (i <= productData.length) {
        choseProduct(i);
        i++;
    };
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
    const $item__img = document.getElementsByClassName('item__img');
    const $title = document.getElementById('title');
    const $price = document.getElementById ('price');
    const $description = document.getElementById('description');
    const $select = document.querySelector('select');

    const $img = document.createElement('img');
    const $createNewOption = () => document.createElement('option');

    const product = await detailProductData();

    $img.setAttribute('src', await product.imageUrl);
    $img.setAttribute('alt', await product.altTxt);
    $item__img[0].appendChild($img);

    $title.innerText = await product.name;
    $price.innerText = await product.price;
    $description.innerText = await product.description;
    const $newOption = $createNewOption();
    $newOption.setAttribute('value', 'blue');
    $newOption.innerText = 'blue';
    $select.appendChild = $newOption;

    // await product.colors.forEach(function (element, index) {
    //     const $newOption = $createNewOption();
    //     $newOption.setAttribute('value', element);
    //     $select.appendChild = $newOption;
    //     console.log(product.colors[index]);
    //     console.log($newOption);
    //     console.table(element);
    // });
    console.log($select);
};
fillProductPage();
