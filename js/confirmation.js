/**
 * Récupère le numéro de commande contenu dans l'URL
 * l'insère dans le DOM
 */
const str = window.location.href;
const url = new URL(str);
const searchParams = new URLSearchParams(url.search);

if (searchParams.has("id")) {
    const id = searchParams.get("id");
    const $orderId = document.getElementById("orderId");
    $orderId.innerText = id;
} else {
    console.log("aucun id n'a été trouvé pour la page");
}
