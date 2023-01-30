/**
 * Récupère l'ensemble de la BDD produits via l'API Products
 * @returns {Promise}
 * @returns {Promise.resolve.Array.<Object>} Tableau contenant un objet/produit présent dans la BDD
 * @returns {Promise.reject<Error>}
 */
export const retrieveProductsData = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        return await res.json();
    } catch (err) {
        console.error("Argh! Une erreur! ");
        console.log(err);
    }
};
