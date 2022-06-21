loadCarrossel();

function loadCarrossel() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://four-line.herokuapp.com/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        var trHTML = ''; 
        var count = 0 ;
        console.log(objects);
        trHTML += '<ol class="carousel-indicators">'
        for(let object of objects){
            if(count == 0){
              trHTML+= '<li data-target="#carousel" data-slide-to="'+count+'" class="active"></li>'
            }else{
              trHTML += '<li data-target="#carousel" data-slide-to="'+count+'"></li>'
              count++;
            }
          }
          trHTML += '</ol>'
          trHTML += '<div class="carousel-inner">'
        count = 0;
        for (let object of objects) {
          
            if (count == 0){
                trHTML += '<div class="carousel-item active">';
                trHTML += '<img class="d-block w-100" src='+object['urlLogo']+' alt='+object['nome']+'>';
                trHTML += '</div>';
            }
            else{
              trHTML += '<div class="carousel-item">';
              trHTML += '<img class="d-block w-100" src='+object['urlLogo']+' alt='+object['nome']+'>';
              trHTML += '</div>';
            }
            count = count + 1;

        }
        trHTML += '</div>';
        trHTML += '<a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">'
        trHTML += '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'
        trHTML +='<span class="sr-only">Anterior</span>'
        trHTML +='</a>'
        trHTML +='<a class="carousel-control-next" href="#carousel" role="button" data-slide="next">'
        trHTML +='<span class="carousel-control-next-icon" aria-hidden="true"></span>'
        trHTML +='<span class="sr-only">Próximo</span>'
        trHTML +='</a>'
        document.getElementById("carousel").innerHTML = trHTML;
      }
    };
}

/*

function loadCarrossel() {
const xhttp = new XMLHttpRequest();
    
xhttp.open("GET", "https://four-line.herokuapp.com/api/Patrocinador");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        counter = 0
        const setImage = () => {
          var object = objects[counter];
          var urlImagem = object['urlLogo'];
          var nomePat = object['nome'];
          var website = object['website'];
          document.getElementById("patrocinadores").innerHTML =  "<a href='"+website+"' style='font-size: 72px; text-decoration: none'>"+ nomePat + "</a>";
          document.getElementById("carousel-image").src = urlImagem;



          counter = counter + 1 ;
          counter = (counter+1)  %  objects.length;
        }

        setInterval(setImage, 5000);
        }

      }
    };
    */