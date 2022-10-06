/**
 * Récupère l'ensemble de la BDD produits via l'API Products
 * @returns {Promise}
 * @returns {Promise.resolve.Array.<Object>} Tableau contenant un objet/produit présent dans la BDD
 * @returns {Promise.reject<Error>}
 */

const retrieveProductsData = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        return await res.json();
    } catch (err) {
        console.alert("Argh!\nUne erreur!\n\n" + err);
    }
};

/**
 * Récupère le détail des options du produit ciblé en index
 * @param {Integer} index
 * @returns {Promise.Object.<colors:[String], id: String, name: String, imageUrl:String, description: String, altTxt: String>}
 */
const optionsProductfromApi = async (index) => {
    const productData = await retrieveProductsData();
    const product = productData[index];

    return {
        colors: product.colors,
        id: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        description: product.description,
        altTxt: product.altTxt,
    };
};

/**
 * Pour la ligne de la BDD produits ciblée en index:
 * récupère le détail des options du produit (appelle optionsProductfromApi)
 * et affiche ces éléments dans le DOM
 * @param {Integer} index
 */
const createItem = async (index) => {
    const items = document.getElementById("items");
    const product = await optionsProductfromApi(index);

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

/**
 * Récupère la BDD produits
 * Crée un Item sur la page d'Acceuil pour chaque ligne de la BDD
 */
const main = async () => {
    const productData = await retrieveProductsData();
    await productData.forEach((element, index) => {
        createItem(index);
    });
};

main();
