/*Regular expressions */

const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const regexName = /^[a-zA-Z\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/;
const regexPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const regexRFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
var code;

function generateCode() {
    var code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
}

function sendEmail(form, event){
    event.preventDefault();
    //alert("sendEmail");
    //alert("I am on the function")
    //Getting the attributes
    const name = document.getElementById('name').value;
    const apat = document.getElementById('apat').value;
    const amat = document.getElementById('amat').value;
    const email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    var userType = 0;
    var rfc = '';
    code = generateCode();
    //console.log("Hello " +code);
    //Seller 
    if(document.getElementById('sellerUser').checked){
        userType = 1;
        rfc = document.getElementById('rfc').value;
        if(rfc == ''){
            Toastify({
                text: "Completa todos los campos requeridos",
                backgroundColor: "#e53935",
                color: "#000000",
                className: "info",
                position: "right",
                gravity: "top"
            }).showToast();
            return;
        }
        else if(!regexRFC.exec(rfc)){
            Toastify({
                text: "RFC no válido",
                backgroundColor: "#e53935",
                color: "#000000",
                className: "info",
                position: "right",
                gravity: "top"
            }).showToast();
            return;
        }
    }
    //Valid data
    if(name == '' || apat == '' || amat == '' || email == '' || password == ''){
        Toastify({
            text: "Completa todos los campos requeridos",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexName.exec(name)) {
        Toastify({
            text: "Nombre no válido. Ingresa solo letras",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    else if(phone != ''){
        if(!regexPhone.exec(phone)){
            Toastify({
                text: "Teléfono no válido",
                backgroundColor: "#e53935",
                color: "#000000",
                className: "info",
                position: "right",
                gravity: "top"
            }).showToast();
            return;
        }
    }
    if (!regexName.exec(apat)) {
        Toastify({
            text: "Apellido paterno no válido. Ingresa solo letras",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexName.exec(amat)) {
        Toastify({
            text: "Apellido materno no válido. Ingresa solo letras",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexEmail.exec(email)) {
        Toastify({
            text: "Email no válido",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexPassword.exec(password)) {
        Toastify({
            text: "Contraseña no válida",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    const terms = document.getElementById('terms');
    if(!terms.checked){
        Toastify({
            text: "Para registrarte tienes que aceptar los términos y condiciones",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    var xhr = new XMLHttpRequest();
    //open the request
    xhr.open('POST',"/users/sendEmail", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    xhr.send(JSON.stringify({name: name, email: email, userType: userType, code:code}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
            //show alert
            //error sending email
            if(jsonvuelta.status == -1){
                Toastify({
                    text: jsonvuelta.message,
                    backgroundColor: "#e53935",
                    color: "#000000",
                    className: "info",
                    position: "right",
                    gravity: "top"
                }).showToast();
            }
            else{
                Toastify({
                    text: jsonvuelta.message,
                    backgroundColor: "#43a047",
                    color: "#000000",
                    className: "info",
                    position: "right",
                    gravity: "top"
                }).showToast();
                $('#exampleModal').modal('show');
            }
            //$('#exampleModal').modal('show');
            //M.toast({html: jsonvuelta.mensaje});//toast is a materialie's property
        }
    }
}
/**
 * Function to register an user
 * No params 
 */
 function registerUser(form, event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    const apat = document.getElementById('apat').value;
    const amat = document.getElementById('amat').value;
    const email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    var userType = 0;
    var rfc = '';
    var userCode = document.getElementById('userCode').value;
    console.log(userCode);
    if(userCode !== code){
        Toastify({
            text: "Código de verifcación incorrecto, Intente nuevamente",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if(phone == ''){
        phone = 0;
    }
    //Seller 
    if(document.getElementById('sellerUser').checked){
        userType = 1;
        rfc = document.getElementById('rfc').value;
    }
    var xhr = new XMLHttpRequest();
    //open the request
    xhr.open('POST',"/users/registerUser", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    xhr.send(JSON.stringify({name: name, apat: apat, amat: amat, email: email, phone: phone , password: password, rfc: rfc, userType: userType}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
            $('#exampleModal').modal('hide');
            document.getElementById('name').value = '';
            document.getElementById('apat').value = '';
            document.getElementById('amat').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('password').value = '';
            document.getElementById('terms').checked = false;
            Toastify({
                text: jsonvuelta.message+" Inicia sesión para comenzar",
                backgroundColor: "#43a047",
                color: "#000000",
                className: "info",
                position: "right",
                gravity: "top"
            }).showToast();
        }
    }
}

function loginUser(form, event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    var userType = 0;
    if(email == ''){
        Toastify({
            text: "Complete el campo de email",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexEmail.exec(email)) {
        Toastify({
            text: "Email no válido",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if(password == ''){
        Toastify({
            text: "Complete el campo de contraseña",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if (!regexPassword.exec(password)) {
        Toastify({
            text: "Contraseña no válida",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if(document.getElementById('sellerUser').checked){
        userType = 1;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/users/loginUser", true);//Enviar la peticion a la ruta en user, login is a route
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({email: email, password: password, userType:userType}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
            if (jsonvuelta.status == -1) {
                //TODO: Change alert for a boostrap alert
                //alert(jsonvuelta.message);
                Toastify({
                    text: jsonvuelta.message,
                    backgroundColor: "#e53935",
                    color: "#000000",
                    className: "info",
                    position: "right",
                    gravity: "top"
                }).showToast();
                //$('#toast').toast('show');
                
            }
            else{
                //buyer
                if(jsonvuelta.status == 0){
                    //alert("BuyerHome")
                    window.location.href = "/users/buyerHome";
                }    
                //seller
                else
                    window.location.href = "/users/sellerHome";
            }
        }
    }
}
/**
 * Function to register a Product
 * form: a form with the data
 * event: The event
 */
function registerProduct(form, event){
    event.preventDefault();
    //Getting the attributes
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const select_category = document.getElementById('category');
    const category = select_category.options[select_category.selectedIndex].value;
    if(name == '' || description == '' || price == '' || stock == ''){
        Toastify({
            text: "Completa todos los campos requeridos",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return
    }
    if (!regexName.exec(name)) {
        Toastify({
            text: "Nombre del producto no válido. Ingresa solo letras",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    if(description.length < 10 || description.length > 150){
        Toastify({
            text: "La descripción debe tener de 10-50 caracteres",
            backgroundColor: "#e53935",
            color: "#000000",
            className: "info",
            position: "right",
            gravity: "top"
        }).showToast();
        return;
    }
    //const img = document.getElementById('img').value;
    var img1 = document.getElementById("img1").value.split("\\");
    var img1Name = img1[img1.length-1];
    var img2 = document.getElementById("img2").value.split("\\");
    var img2Name = img2[img2.length-1];
    var img3 = document.getElementById("img3").value.split("\\");
    var img3Name = img3[img3.length-1];
    var img4 = document.getElementById("img4").value.split("\\");
    var img4Name = img4[img4.length-1];
    var carac1 = document.getElementById('carac1').value;
    var carac2 = document.getElementById('carac2').value;
    var carac3 = document.getElementById('carac3').value;
    //alert(carac1);
    //alert("Categorie: "+category);
    //alert("IMG1: "+img1Name);
    //alert("IMG2: "+img2Name);
    var xhr = new XMLHttpRequest();
    //open the request
    xhr.open('POST',"/users/registerProduct", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    xhr.send(JSON.stringify({name: name, description: description, carac1: carac1 , carac2: carac2, carac3: carac3, category: category, price: price, stock: stock, img1: img1Name, img2: img2Name, img3: img3Name, img4: img4Name}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
            //show alert
            Toastify({
                text: jsonvuelta.message,
                backgroundColor: "#43a047",
                color: "#000000",
                className: "info",
                position: "right",
                gravity: "top"
            }).showToast();
            //M.toast({html: jsonvuelta.mensaje});//toast is a materialie's property
        }
    }
}
/**
 * Function to register a Product
 * form: a form with the data
 * event: The event
 */
 function addToCart(form, event){
    event.preventDefault();
    var formElements = form.elements;
    var productId = formElements[0].id;
    var xhr = new XMLHttpRequest();
    //open the request   
    xhr.open('POST',"/users/addToCart", true);
    xhr.setRequestHeader("Content-type", "application/json");
    //sending data
    xhr.send(JSON.stringify({productId: productId}));
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status== 200) {
            //console.log('server answered',this.responseText);
            let jsonvuelta = JSON.parse(xhr.responseText);//We are parsing the Json gotten to understand it
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
}




