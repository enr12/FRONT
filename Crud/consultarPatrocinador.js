function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://four-line.herokuapp.com/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td><img width="50px" src="'+object['urlLogo']+'" class="avatar"></td>';
          trHTML += '<td>'+object['nome']+'</td>';
          trHTML += '<td>'+object['website']+'</td>';
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
}

loadTable();

function showUserCreateBox() {
    Swal.fire({
      title: 'Criar Patrocinador',
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      html:
        '<input id="Id" type="hidden">' +
        '<br><br><label >Nome:'+ '</label><br> ' +
        '<input required type="text" id="createNome" class="swal2-input" placeholder="Nome">' +
        '<br><br><label >Email:'+ '</label><br> ' +
        '<input required type="email" id="createEmail" class="swal2-input" placeholder="exemplo@mail.com">' +
        '<br><br><label >URL Logo:'+ '</label><br> ' +
        '<input required type="file" id="createLogo" class="swal2-input" placeholder="http://exemplo.com.br/img.png">' +
        '<br><br><label >URL Website:'+ '</label><br> ' +
        '<input required type="url" id="createWebsite" class="swal2-input" placeholder="http://exemplo.com.br">' +
        '<br><br><label >Celular:'+ '</label><br> ' +
        '<input required type="tel" id="createCel" maxlength="17" class="swal2-input js-field-personal_phone" placeholder="(11) 99999-9999">' ,
      focusConfirm: false,
      preConfirm: () => {
        NomePat = document.getElementById('createNome').value;
        Email = document.getElementById('createEmail').value;
        UrlLogo = document.getElementById("createLogo").files[0];
        Website = document.getElementById('createWebsite').value;
        Celular = document.getElementById('createCel').value;

       if( !NomePat || !Email || !UrlLogo  || !Website || !Celular ) {
        Swal.fire('Preencha todos os campos!');
       }
       else {

        salvarImagemFirebase(UrlLogo, NomePat, Email, Website, Celular, 0);
       }
      }
    })
}

/*async function trazerImagemFirebase(url){
  const firebaseConfig = {
    apiKey: "AIzaSyCKU6lw0J2J8_pUyEBgSPrT4l2yptnBPZQ",
    authDomain: "forline-4ef2b.firebaseapp.com",
    projectId: "forline-4ef2b",
    storageBucket: "forline-4ef2b.appspot.com",
    messagingSenderId: "475759422512",
    appId: "1:475759422512:web:ca8405d44016448cf0d1f5",
    measurementId: "G-BQV4FC6PW1"
  };
  firebase.initializeApp(firebaseConfig);
  console.log(url);

  //substring url da imagem a partir da ?
var urlImgJson = url.substring(0,url.indexOf('?'));
console.log(urlImgJson);
  //trazer o name do json da imagem

var xhr = new XMLHttpRequest();
xhr.onload = (event) => {
  var blob = xhr.response;
};
xhr.open('GET', urlImgJson);
xhr.send();



}*/

async function salvarImagemFirebase(url, nomeImagem, Email, Website, Celular, atualizacao){
  const firebaseConfig = {
    apiKey: "AIzaSyCKU6lw0J2J8_pUyEBgSPrT4l2yptnBPZQ",
    authDomain: "forline-4ef2b.firebaseapp.com",
    projectId: "forline-4ef2b",
    storageBucket: "forline-4ef2b.appspot.com",
    messagingSenderId: "475759422512",
    appId: "1:475759422512:web:ca8405d44016448cf0d1f5",
    measurementId: "G-BQV4FC6PW1"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app();
 }

  let storage = firebase.storage();

  var file = url;

  /* var date = new Date();x

  var name = date.getDate() + '' + date.getMonth + '' + date.getFullYear + '-' + nomeImagem;*/

  var date = new Date().toLocaleDateString();
  var date = date.replace(/\//g, "_");
  var nomeImagemF =  nomeImagem + '_' + date;

  const metadata = {
    contentType:file.type
  }

  const ext = file.type.substring(file.type.indexOf('/')+1);

  upload = storage.ref().child("ImagensPatrocinador").child(nomeImagemF + '.' + ext).put(file, metadata);

  upload.on("state_changed", function () {
    upload.snapshot.ref.getDownloadURL().then(function (url_imagem) {
      if (atualizacao == 0) {
        userCreate(url_imagem, Email, Website, Celular, nomeImagem);
        

      }
      else {
        userEdit(url_imagem, nomeImagem,  Email, Website, Celular, atualizacao);
      }
    })
  }
  )
}

function userCreate(url_imagem, email, web, celular, nome) {


   //alert()
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://four-line.herokuapp.com/api/Patrocinador/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
      "nome": nome, "website": web,  "email": email, "celular": celular, "urlLogo": url_imagem
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 201) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['nome'] + ' criado com sucesso!');
        loadTable();

      }
      else {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      }
    };
}


function userDelete(id) {

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  swalWithBootstrapButtons.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter essa mudança",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("DELETE", "https://four-line.herokuapp.com/api/Patrocinador/"+id);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({ 
        "id": id
      }));
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          const objects = JSON.parse(this.responseText);
          swalWithBootstrapButtons.fire(
            objects['message'],
            '',
            'success'
          )
          loadTable();
        } 
      };
      
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Patrocinador não deletado',
        '',
        'error'
      )
      loadTable();
    }
  })

}

function showUserEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://four-line.herokuapp.com/api/Patrocinador/"+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const user = objects;
      Swal.fire({
        title: 'Atualizar Patrocinador',
        showCancelButton: true,
        confirmButtonText: 'Atualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        html:
          '<input id="id" type="hidden" value='+user['id']+'>' +
          '<input style="display: block; margin: 0 auto; padding: 20px" type="image" width="200" height="auto" src="'+user['urlLogo']+'">' +
          '<br><br><label >Nome:'+ '</label><br> ' +
          '<input id="editNome" class="swal2-input" placeholder="Nome" value="'+user['nome']+'">' +
          '<br><br><label >Email:'+ '</label><br> ' +
          '<input id="editEmail" class="swal2-input" placeholder="Email" value="'+user['email']+'">' +
          '<br><br><label >Celular:'+ '</label><br> ' +
          '<input id="editCel" class="swal2-input" placeholder="Celular" value="'+user['celular']+'">' +
          '<br><br><label >URL Website:'+ '</label><br> ' +
          '<input id="editWebsite" class="swal2-input" placeholder="Website" value="'+user['website']+'">' +
          '<br><br><label >URL Logo:'+ '</label><br> ' +
          '<input id="editLogo" required type="file" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          var urlEdit = document.getElementById("editLogo").files[0];
          var NomePat = document.getElementById('editNome').value;
          var Email = document.getElementById('editEmail').value;
          var Website = document.getElementById('editWebsite').value;
          var Celular = document.getElementById('editCel').value;
          if( !NomePat || !Email  || !Website || !Celular ) {
            Swal.fire('Preencha todos os campos!');
           }
           else {
            if (!urlEdit){
              userEdit(user['urlLogo'], NomePat, Website, Email, Celular, user['id']);
            }
            else{
            salvarImagemFirebase(urlEdit, NomePat, Email, Website, Celular, user['id']);
          }
           }
        }
      })
    }
  };
}

function userEdit(url_imagem, nome, website, email, celular, idPat) {

  const urlLogo = url_imagem;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "https://four-line.herokuapp.com/api/Patrocinador/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id": idPat, "nome": nome, "website": website, "email": email, "celular": celular, "urlLogo": urlLogo
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['nome'] + ' atualizado com sucesso!');
      loadTable();
    }
    else {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects['message']);
      loadTable();
    }
  };
}