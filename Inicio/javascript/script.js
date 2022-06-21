const inputs = document.querySelectorAll('.input');
const button = document.querySelector('.login__button');

const handleFocus = ({ target }) => {
    const span = target.previousElementSibling;
    span.classList.add('span-active');
}

const handleFocusOut = ({ target }) => {
    if(target.value == '') {
        const span = target.previousElementSibling;
        span.classList.remove('span-active');
    }
}

const handleChange = ({  }) => {
    const [username, password, name] = inputs;

    if (username.value && password.value.length >= 4) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
}

inputs.forEach((input) => input.addEventListener('focus', handleFocus));
inputs.forEach((input) => input.addEventListener('focusout', handleFocusOut));
inputs.forEach((input) => input.addEventListener('input', handleChange));

function PostLogin() {
    var nome = document.getElementById('nome').value;
    var senha = document.getElementById('senha').value;  

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://four-line.herokuapp.com/api/Usuario/Validacao");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({ 
        "nomeUsuario": nome, "senha": senha
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            window.sessionStorage.setItem('nomeUsuario', objects['nomeUsuario']);
            window.sessionStorage.setItem('id', objects['id']);
            if (objects['tipoUsuario'] == 1){
                window.location.href = "../Crud/index.html";
            }
            else {
                window.location.href = "./saguao.html";
            }
        }
        else {
            const objects = JSON.parse(this.responseText);
            if (objects['message'])
            Swal.fire(objects['message'])
        }
    }
}


