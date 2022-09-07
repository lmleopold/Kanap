// Connexion à l'API

const retrieveProductsData = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        return await res.json();
    } catch (err) {
        console.alert('Argh!\nUne erreur!\n\n' + err);
    }
};

// Récupération des infos produits

const detailProductData = async (index) => {
    const productData = await retrieveProductsData();
    const product = productData[index];

    return {
        detailsProduit: product,
        couleurs: product.colors,
        id: product._id,
        nom: product.name,
        prix: product.price,
        urlImage: product.imageUrl,
        description: product.description,
        texteAlternatif: product.altTxt,
    };
};

// Remplissage de la rubrique Items

const createItem = async (index) => {
    const $items = document.getElementById('items');
    const details = await detailProductData(index);

    const link = document.createElement('a');
    link.setAttribute('href', `./product.html?Id=${details.id}`);
    $items.appendChild(link);

    const newArticle = document.createElement('article');
    link.appendChild(newArticle);

    const img = document.createElement('img');
    img.setAttribute('src', details.urlImage);
    img.setAttribute('alt', details.texteAlternatif);
    newArticle.appendChild(img);

    const productName = document.createElement('h3');
    productName.classList.add('productName');
    productName.innerText = details.nom;
    newArticle.appendChild(productName);

    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.innerText = details.description;
    newArticle.appendChild(productDescription);
};

const main = async () => {
    const productData = await retrieveProductsData();
    await productData.forEach(function (element,index) {
        createItem(index);
    });

};

main();
