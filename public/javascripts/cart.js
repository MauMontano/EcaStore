
/**
 * Animations for cart
 */
var total = 0;

jQuery(function() {
    var cartTotal = document.getElementById('total');
    var products = document.getElementsByClassName('units');
    Array.prototype.forEach.call(products, function(product) {
        var price = parseInt(product.textContent.split("$").pop());
        total = total + price;
    });
    //alert(products[0].textContent);
    cartTotal.textContent = '$' + total;
})

function addMoreUnitsToCart(button){
    var unitPrice = 0;
    var totalPrice = 0;
    var numUnitsElement = button.parentNode.querySelector('input[type=number]');
    var stock = parseInt(document.getElementById('product'+numUnitsElement.id+"Stock").textContent);
    if(stock < (parseInt(numUnitsElement.value)+1)){
        Toastify({
            text: "Solo quedan " + stock + " unidades disponibles",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    numUnitsElement.stepUp();
    var priceElement = document.getElementById('product'+numUnitsElement.id+"Price");
    var obtainedPrice = parseInt(priceElement.textContent.split("$").pop()); 
    var numUnits = numUnitsElement.value;
    //alert(numUnits);
    unitPrice = obtainedPrice/((numUnits)-1); 
    totalPrice = unitPrice*numUnits;
    priceElement.textContent = "$" + totalPrice;
    addTotal(totalPrice, numUnits);
    modifyUnitsCart(numUnitsElement.id, numUnits);
}

function quitUnitsFromCart(button){
    var unitPrice = 0;
    var totalPrice = 0;
    var numUnitsElement = button.parentNode.querySelector('input[type=number]');
    if(parseInt(numUnitsElement.value) == 1)
        return;  
    numUnitsElement.stepDown();
    var priceElement = document.getElementById('product'+numUnitsElement.id+"Price");
    var obtainedPrice = parseInt(priceElement.textContent.split("$").pop()); 
    var numUnits = parseInt(numUnitsElement.value);
    //alert(numUnits+1);
    unitPrice = obtainedPrice/((numUnits)+1);
    totalPrice = unitPrice*numUnits;
    priceElement.textContent = "$" + totalPrice;
    quitTotal(totalPrice, numUnits);
    modifyUnitsCart(numUnitsElement.id, numUnits);
}

function modifyUnitsCart(productId, numUnits){
    var xhr = new XMLHttpRequest();
    //open the request   
    xhr.open('POST',"/users/modifyProductUnits", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    xhr.send(JSON.stringify({productId: productId, numUnits: numUnits}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
            //alert(jsonvuelta.quantity);
            //alert(parseInt(numUnitsElement.value)+1);
            //error
            if(jsonvuelta.status != 1){
                Toastify({
                    text: "Ocurrió un error",
                    backgroundColor: "#e53935",
                    color: "#000000",
                    className: "info",
                    position: "right",
                    gravity: "top"
                }).showToast();
                return;
            }
        }
    }
}

function addTotal(newPrice, numUnits){
    total = total + (newPrice/numUnits);
    document.getElementById('total').textContent = '$' + total;
}

function quitTotal(newPrice, numUnits){
    total = total - (newPrice/numUnits);
    document.getElementById('total').textContent = '$' + total;
}
/*
function buyCart(form, event){
    event.preventDefault();
    productList = [];
    var products = document.getElementsByClassName('productQuantity');
    Array.prototype.forEach.call(products, function(prod) {
        let product = {"productId": prod.id, "productQuantity": prod.value}
        productList.push(product);     
    });
    window.location.href = "/users/payment";
    
} */

function payCart(){
    var idDirection;
    var idMethod;
    productList = [];
    var directions = document.getElementsByClassName('dirRatio');
    var methods = document.getElementsByClassName('methodRatio');
    var products = document.getElementsByClassName('productQuantity');
    Array.prototype.forEach.call(products, function(prod) {
        let product = {"productId": prod.id, "productQuantity": parseInt(prod.textContent)}
        //alert(product.productQuantity);
        productList.push(product);     
    });
    Array.prototype.forEach.call(directions, function(dir) {
        if(dir.checked){
            idDirection = dir.id;
        }
    });
    Array.prototype.forEach.call(methods, function(method) {
        if(method.checked){
            idMethod = method.id;
        }
    });
    //let product = {"productId": prod.id, "productQuantity": prod.value}
    //productList.push(product);
    /*alert("id direccion");     
    alert(idDirection);
    alert("id method");
    alert(idMethod);
    alert("id product");
    alert(productList[0].productId);
    alert("cantidad");
    alert(productList[0].productQuantity);*/
    var xhr = new XMLHttpRequest();
    //open the request   
    xhr.open('POST',"/users/payCart", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    Array.prototype.forEach.call(productList, function(product) {
        xhr.send(JSON.stringify({
            productId: parseInt(product.productId),
            productQuantity: product.productQuantity,
            directionId: parseInt(idDirection),
            methodId: parseInt(idMethod)
        }));
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status== 200) {
                //console.log('server answered',this.responseText);
                let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
                //alert(jsonvuelta.quantity);
                //alert(parseInt(numUnitsElement.value)+1);
                //error
                if(jsonvuelta.status != 1){
                    Toastify({
                        text: jsonvuelta.message,
                        backgroundColor: "#e53935",
                        color: "#000000",
                        className: "info",
                        position: "right",
                        gravity: "top"
                    }).showToast();
                    return;
                }
                Toastify({
                    text: jsonvuelta.message,
                    backgroundColor: "#43a047",
                    color: "#000000",
                    className: "info",
                    position: "right",
                    gravity: "top"
                }).showToast();
            }
        }  
    });
    /*
    productlist.forEach(function(product){
        
    }) */
}

/*we will store the products in an array, then we will redirect to buy page route
when the user choose every issue about the payment, we will send the array
created previously to the route buyCart 
*/
