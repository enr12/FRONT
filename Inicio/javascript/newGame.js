const audio = document.querySelector('audio')
const screen = document.getElementById('screen')
const tabHelper = document.getElementById('helper')
const tabJog = document.getElementById('vezJogador')
const largura = 7
const altura = 6
const tabuleiro = altura * largura
const imgTabuleiro = '';

const connection = new signalR.HubConnectionBuilder().withUrl("https://four-line.herokuapp.com/jogo").withAutomaticReconnect().build();
var campos = []
var vez = 0
const nomeUsuario = window.sessionStorage.getItem('nomeUsuario');

var dadosPatrocinadorImagens = null;
function voltar() {
    Swal.fire({
        title: 'Tem certeza?',
        text: "A partida será contabilizada como derrota!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sair',
        allowOutsideClick: false 
      }).then((result) => {
        if (result.isConfirmed) {
            disconnected("1");
            location.href='saguao.html';
        }
      })
}

for(let i = 0; i < altura * largura; i++)
{
    campos[i] = 0
}

jogarNovamente();

function jogarNovamente() {
    const urlParams = new URLSearchParams(window.location.search);
    const jogar = urlParams.get('jogarNovamente');
    urlParams.delete('jogarNovamente');
    if (jogar == 1) {
        document.getElementById("botaoJogar").click();
    }
}

async function start() {
    try {
        const idUsuario = window.sessionStorage.getItem("id");

        await connection.start();
        connection.invoke('ConectarSala',connection.connectionId, nomeUsuario, idUsuario)
        console.log("SignalR Connected.");

    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function carregarTabuleiro() {
    const connectonIdOld = window.sessionStorage.getItem("connectionId");
    console.log(connectonIdOld);

    await connection.start();
    await connection.invoke("ConsertaConnectionId", connection.connectionId, connectonIdOld);

    window.sessionStorage.setItem("connectionId", connection.connectionId);

    await connection.invoke('DistribuiArray',campos,1,1,null,null,connection.connectionId,0);
    await connection.invoke('SolicitarDadosPartida', connection.connectionId);
    atualizaImagens();
}

connection.on("obterDadosPartida", (jogador1, jogador2, dadosPatrocinador) => {
    document.getElementById("jogador1").innerText = jogador1['nickName'];
    document.getElementById("jogador2").innerText = jogador2['nickName'];
    console.log(dadosPatrocinador)
    window.sessionStorage.setItem("tabuleiro", dadosPatrocinador.tabuleiro); 
    window.sessionStorage.setItem("ficha1", dadosPatrocinador.ficha1); 
    window.sessionStorage.setItem("ficha2", dadosPatrocinador.ficha2); 
    window.sessionStorage.setItem("banner", dadosPatrocinador.banner); 
    window.sessionStorage.setItem("url", dadosPatrocinador.url); 


});

function atualizaImagens() {

    listaTabela = document.getElementsByClassName("tabelaPrincipal");
    imagemTabela = window.sessionStorage.getItem("tabuleiro");
    changeBackground(listaTabela, imagemTabela);

    listaPecaRed = document.getElementsByClassName("red");
    imagemPecaRed = window.sessionStorage.getItem("ficha1");
    changeBackground(listaPecaRed, imagemPecaRed);
    
    /*listaPecaRedHover = document.getElementsByClassName("playerAction1:hover");
    imagemPecaRedHover = window.sessionStorage.getItem("ficha1");
    changeBackground(listaPecaRedHover, imagemPecaRedHover);*/

    listaPecaBlue = document.getElementsByClassName("blue");
    imagemPecaBlue = window.sessionStorage.getItem("ficha2");
    changeBackground(listaPecaBlue, imagemPecaBlue);

    listaPecaBlueHover = document.getElementsByClassName("playerAction2:hover");
    imagemPecaBlueHover = window.sessionStorage.getItem("ficha2");
    /*changeBackground(listaPecaBlueHover, imagemPecaBlueHover);*/
    var imgPat = window.sessionStorage.getItem("banner");
    var urlPat = window.sessionStorage.getItem("url");
    //console.log(imgPat);
    document.getElementById('urlPat').href = urlPat;
    document.getElementById('imgPat').src = imgPat;
}

function changeBackground(lista, imagem){

    for(var i=0, len=lista.length; i<len; i++)
    {
        lista[i].style["background-image"] = `url('${imagem}')`;
    }
}

async function disconnected(motivo) { // motivo 1 - desistiu; motivo 2 - timer zero; motivo 3 - cancelo looby
    await connection.invoke('DesconectarSala', connection.connectionId, motivo);
    window.sessionStorage.removeItem("connectionId");
    await connection.stop();
}

connection.on("adversarioDesistiu", (motivo) => { 
    if (motivo === "1") {
        starttimer('STOP', 0)
        Swal.fire({
            icon: 'info',
            title: "Outro jogador abandonou a partida, você venceu!!!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Jogar Novamente',
            cancelButtonText: 'Voltar para o saguão',
            reverseButtons: true,
            allowOutsideClick: false 
            }).then((result) => {
                window.sessionStorage.removeItem("connectionId");
                if (result.isConfirmed) {
                    location.href='saguao.html?jogarNovamente=1';
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    location.href='saguao.html';
                }
            })
    }
    else if (motivo === "2") {
        starttimer('STOP', 0)
        Swal.fire({
            icon: 'info',
            title: "Outro jogador não fez sua jogada a tempo, você venceu!!!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Jogar Novamente',
            cancelButtonText: 'Voltar para o saguão',
            reverseButtons: true,
            allowOutsideClick: false 
            }).then((result) => {
                window.sessionStorage.removeItem("connectionId");
                if (result.isConfirmed) {
                    location.href='saguao.html?jogarNovamente=1';
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    location.href='saguao.html';
                }
            })
    }
});

connection.on("avisoPerdeu", (motivo) => {
    if (motivo === "2") {
        starttimer('STOP', 0)
        Swal.fire({
            icon: 'info',
            title: "Você perdeu, timer zerado.",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Jogar Novamente',
            cancelButtonText: 'Voltar para o saguão',
            reverseButtons: true,
            allowOutsideClick: false 
            }).then((result) => {
                window.sessionStorage.removeItem("connectionId");
                if (result.isConfirmed) {
                    location.href='saguao.html?jogarNovamente=1';
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    location.href='saguao.html';
                }
            })
    }
});

function marcar(player, X) {
    // trazer array campos do back
    starttimer('STOP', 0)
    if(vez == connection.connectionId){
        console.log('test')
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Não é sua vez',
            timer: 2000,
            timerProgressBar: true,
        })
        return false
    }
    if (X > largura || player == 0) {
        return false
    }
    for (let i = 0; true; i++) {
        var ultimoDaAltura = altura * largura - (largura * (i + 1)) + X
        if (ultimoDaAltura < 0) {
            return false
        }
        if (campos[ultimoDaAltura] == 0) {
            campos[ultimoDaAltura] = player == 1 ? 1 : 2;
            var Y = altura - (i + 1);
            connection.invoke('DistribuiArray',campos,ultimoDaAltura,player == 1 ? 2 : 1,X,Y,connection.connectionId,0)
            
            
            mostraTabela(ultimoDaAltura, player == 1 ? 2 : 1);
            
            return false
        }
    }
}

function attPeca(playerNum, indice) {
    var teste = document.getElementsByClassName('playerAction'+playerNum);
    var img = window.sessionStorage.getItem('ficha'+playerNum);
    for(var i=0, len=teste.length; i<len; i++)
    {
        if (indice === i)
        teste[i].style["background-image"] = `url('${img}')`;
        else
            teste[i].style["background-image"] = '';
    }
}

function limpaPeca(playerNum) {
    var teste = document.getElementsByClassName('playerAction'+playerNum);
    var img = window.sessionStorage.getItem('ficha'+playerNum);
    for(var i=0, len=teste.length; i<len; i++)
    {
            teste[i].style["background-image"] = '';
    }
}

function mostraTabela(atual, player) {
    if(vez == connection.connectionId){
        tabJog.innerHTML =  'Vez do adversário '
        }
    else {
        tabJog.innerHTML =  'Sua vez'
    }
   //Marcador ficha
   var helper = "<center><table onload='atualizaImagens();' style='border: none;' id='PlayerActionTable'><tr>";

   for (let i = 0; i < largura; i++) {
       helper += "<td class='playerActionTd'>"
       helper += "<div class='playerAction playerAction" + player + "' onmouseout='limpaPeca("+player+")' onmouseover='attPeca("+player+","+ i+")' onClick='marcar(" + player + "," + i + ")'></div>"
       helper += "</td>"
   }
   helper += "</tr></table></center>"
   tabHelper.innerHTML = helper
   //trazer array campos back
   var html = "<center><table onload='atualizaImagens();' id='tabJogo' class='tabelaPrincipal' style='border: none;'>"
   for (let i = 0; i < tabuleiro / largura; i++) {
       html += "<tr>"
       for (let j = 0; j < tabuleiro / altura; j++) {
           if (campos[i * largura + j] == 0) {
               html += "<td style='border: none;'> <div style='border: none;' player='0' id='" + (i * largura + j) + "' class='white campo'></div>"
           }
           else if (campos[i * largura + j] == 1) {
               html += "<td style='border: none;'> <div style='border: none;' player='1' id='" + (i * largura + j) + "' class='red campo'></div>"
           }
           else {
               html += "<td style='border: none;'> <div style='border: none;' player='2' id='" + (i * largura + j) + "' class='blue campo'></div>"
           }

           html += "</td>"
       }
       html += "</tr>"
   }
   html += "</table></center>"
   screen.innerHTML = html


   if (atual != -1) {
       let deslocar = Math.floor(atual / largura) * 100
       document.getElementById(atual).setAttribute("style", "transform: translateY(-" + deslocar + "px);animation: peca 2s forwards'")
   }
   atualizaImagens();
}

        connection.on("DistribuiArray", (retorno, ultimo, player, vezdequem, encerrada) => {
            campos = retorno
            vez = vezdequem
            mostraTabela(ultimo,player)
            starttimer('START', vezdequem)

            if (encerrada != 0 && encerrada != 3)
            {
                starttimer('STOP', 0)
                Swal.fire({
                    icon: 'info',
                    title: "Jogador " + document.getElementById("jogador" + player).innerText + " venceu!!!",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Jogar Novamente',
                    cancelButtonText: 'Voltar para o saguão',
                    reverseButtons: true,
                    allowOutsideClick: false 
                    }).then((result) => {
                        window.sessionStorage.removeItem("connectionId");
                        if (result.isConfirmed) {
                            location.href='saguao.html?jogarNovamente=1';
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            location.href='saguao.html';
                        }
                    })
            }

            if (encerrada == 3)
            {
                starttimer('STOP', 0)
                Swal.fire({
                    icon: 'info',
                    title: "Empate",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Jogar Novamente',
                    cancelButtonText: 'Voltar para o saguão',
                    reverseButtons: true,
                    allowOutsideClick: false 
                    }).then((result) => {
                        window.sessionStorage.removeItem("connectionId");
                        if (result.isConfirmed) {
                            location.href='saguao.html?jogarNovamente=1';
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            location.href='saguao.html';
                        }
                    })
            }

            if(vez == connection.connectionId){
                document.getElementById('PlayerActionTable').style.visibility="hidden";
            }else{
                document.getElementById('PlayerActionTable').style.visibility="normal";
            }
        });

        connection.on("InicioPartida", (retorno) => {
            window.sessionStorage.setItem("connectionId", connection.connectionId);
            location.href = "game.html";
        });

window.AudioContext = window.AudioContext || window.webkitAudioContext;

		var disp;
		var sec = 0;
		var id = null;

		var ctx = new AudioContext();
		var vol = ctx.createGain();
		vol.gain.value = 0.2;
		vol.connect(ctx.destination);

		function play(n) {
			for (var i = 0; i < n; i++) {
				var osc = ctx.createOscillator();
				osc.type = 'square';
				osc.frequency.value = 2000;
				osc.connect(vol);
				osc.start(ctx.currentTime + 0.00 + i * 0.1);
				osc.stop( ctx.currentTime + 0.05 + i * 0.1);
			}
		}

function starttimer(acao, vezPlayer) {
    play(2);
    
    disp = document.getElementById('disp');

            if (id) {
                clearInterval(id);
                id = null;
            }

            if (acao === 'STOP') {
                acao = 'START';
                play(1);
                return;
            }

    acao = 'STOP';
    play(2);
    sec = 0;
    disp.innerText = 15 - sec;
    id = setInterval(
        function() {
            sec++;
            disp.innerHTML = 15 - sec;
            if (sec === 15) {
                sec = -1;
                play(2);
                if (vezPlayer != "0") {
                    if (vezPlayer != connection.connectionId) {
                        clearInterval(id);
                        disconnected("2");
                    }
                }
            }
        }, 1000);
}
