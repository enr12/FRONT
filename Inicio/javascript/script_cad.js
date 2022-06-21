const inputs = document.querySelectorAll('.input');
const button = document.querySelector('.login__button_cad');


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
    const [username_cad, password_cad, email_cad] = inputs;

    if (username_cad.value && password_cad.value.length >= 4 && email_cad.value) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
}

inputs.forEach((input) => input.addEventListener('focus', handleFocus));
inputs.forEach((input) => input.addEventListener('focusout', handleFocusOut));
inputs.forEach((input) => input.addEventListener('input', handleChange));

function sair() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você será desconectado",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sair'
      }).then((result) => {
        if (result.isConfirmed) {
            window.sessionStorage.clear();
            location.href='../index.html';
        }
      })
}

function PostCadastro() {
    var nome = document.getElementById('nome_cad').value;
    var senha = document.getElementById('senha_cad').value;  
    var email = document.getElementById('email').value;  

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://four-line.herokuapp.com/api/Usuario");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({ 
        "nomeUsuario": nome, "email": email, "senha": senha
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            const objects = JSON.parse(this.responseText);
            console.log(objects)
            window.sessionStorage.setItem('nomeUsuario', objects['nomeUsuario']);
            window.sessionStorage.setItem('id', objects['id']);
            window.location.href = "saguao.html";
        }
        else {
            const objects = JSON.parse(this.responseText);
            if (objects['message'])
            Swal.fire(objects['message']);
        }
    }
}

