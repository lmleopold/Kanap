const str = window.location.href;
const url = new URL(str);
const searchParams = new URLSearchParams(url.search);
let id;
if (searchParams.has('id')) {
    const id = searchParams.get('id');
    console.log(id);
    let $orderId = document.getElementById("orderId");
    console.log($orderId);
    $orderId.innerText =id;
} else {
    console.log("aucun id n'a été trouvé pour la page");
}

