// Connexion à l'API

const retrieveProductsData = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        return await res.json();
    } catch (err) {
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
};

// Récupération des infos relatives à chaque produit

const detailProductData = async (index) => {
    const productData = await retrieveProductsData();
    const product = productData[index];

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

// Remplissage de la rubrique Items (appel detailProductData)

const createItem = async (index) => {
    const items = document.getElementById("items");
    const product = await detailProductData(index);

    const link = document.createElement("a");
    link.setAttribute("href", `./product.html?Id=${product.id}`);
    items.appendChild(link);

    const article = document.createElement("article");
    link.appendChild(article);

    const img = document.createElement("img");
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);
    article.appendChild(img);

    const productName = document.createElement("h3");
    productName.classList.add("productName");
    productName.innerText = product.name;
    article.appendChild(productName);

    const productDescription = document.createElement("p");
    productDescription.classList.add("productDescription");
    productDescription.innerText = product.description;
    article.appendChild(productDescription);
};

// Main récupère la BDD produits via l'API (appel retrieveProductsData)
// On créé un item en page d'acceuil (appel createItem) pour chaque produit

const main = async () => {
    const productData = await retrieveProductsData();
    await productData.forEach(function (element, index) {
        createItem(index);
    });
};

main();
