fetch ("http://localhost:3000/api/products")
.then ((res) => {
    if (res.ok){
        return res.json ();
    }
})
.then ((data) => {
    console.log (data);    
})
.catch ((err) => {
    alert ("erreur :" + err);
});

const newElt = document.createElement("div");
newElt.innerHTML = "<h1>salut!</h1>";
let list = document.getElementById ("items");
console.log (list);
list.appendChild(newElt);
