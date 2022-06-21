function PostLogin() {
    var nome = document.getElementById('nome').value;
    var senha = document.getElementById('senha').value;  

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://four-line.herokuapp.com/api​/Usuario​/Validacao");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({ 
        "nomeUsuario": nome, "senha": senha
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            window.localStorage.setItem('nomeUsuario', objects['nome']);
            if (objects['tipoUsuario'] == 1){
                window.location.href = "./Crud/index.html";
            }
            else {
                window.location.href = "saguao.html";
            }
        }
        else {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects['message']);
        }
    }
}