fetch ("http://localhost:3000/api/products")
.then (function(res){
    if (res.ok){
        return res.json ();
    }
})
.then (function (data) {
    console.log (data);
})
.catch (function (err) {
    alert ("erreur :" + err);
});
