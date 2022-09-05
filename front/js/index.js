

const retrieveProductsData = () =>
    fetch('http://localhost:3000/api/products')
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .catch((err) => {
            alert('Argh!\nUne erreur!\n\n' + err);
        });

async function test() {
    console.table(await retrieveProductsData());
}
test();

const createProductCardImg = product => {
    const $productImg = document.createElement('img')

    $sensorImg.classList.add('sensor-img')

    $sensorImg.setAttribute('src', `/assets/${sensor.img}`)
    $sensorImg.setAttribute('alt', `Capteur numéro ${sensor.id}`)

    return $sensorImg
}

// async function innerText() {
// const newElt = document.createElement('div');
// newElt.innerText = await retrieveProductsData();
// const list = document.getElementById('items');
// console.log(list);
// list.appendChild(await newElt);
// }
// innerText();




const retrieveSensorsData = () =>
    fetch('/data/homepage-data.json')
        .then((res) => res.json())
        .then((data) => data.facades)
        .catch((err) => console.log('Oh no', err));

// const main = async();
