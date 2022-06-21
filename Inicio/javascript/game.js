const audio = document.querySelector('audio')
    audio.currentTime = 0
    const screen = document.getElementById('screen')
    const tabHelper = document.getElementById('helper')
    const tabJog = document.getElementById('vezJogador')
    const largura = 7
    const altura = 6
    const tabuleiro = altura * largura
    const campos = []

    for (let i = 0; i < altura * largura; i++) {
        campos[i] = 0
    }
    //setInterval(mostraTabela , 1000)
    mostraTabela(1, 1)

    function verificaDirecoes(player, X, Y) {
        verificaLargura(player, Y)
        verificaAltura(player, X)
        verificaDiagonalPrimaria(player, X, Y)
        verificaDiagonalSecundaria(player, X, Y)
        verificaCamposVazios()
    }
    function verificaCamposVazios() {
        for (let i = 0; i < campos.length; i++) {
            if (campos[i] == 0) {
                return
            }
        }
        console.log('empate')
    }

    function verificaAltura(player, X) {
        let contador = 0
        for (let i = X; i < tabuleiro; i = i + largura) {
            if (document.getElementById(i).getAttribute('player') == player) {
                contador++
            } else {
                contador = 0;
            }
            if (contador == 4) {
                audio.play();
                ApresentaMensagem(player);
                return player;
            }
        }
    }
    function verificaLargura(player, Y) {
        let contador = 0
        for (let i = Y * largura; i < (Y * largura + largura); i++) {
            if (document.getElementById(i).getAttribute('player') == player) {
                contador++
            } else {
                contador = 0;
            }
            if (contador == 4) {
                audio.play();
                ApresentaMensagem(player);
                return player;
            }
        }
    }
    function verificaDiagonalPrimaria(player, X, Y) {
        var diagonal = X - Y
        if (diagonal < 0) {
            var pontoInicial = 0 + (largura * diagonal * -1)
            var repeticao = altura + diagonal
        } else if (diagonal > 0) {
            var pontoInicial = 0 + diagonal
            var repeticao = largura - diagonal
        } else {
            var pontoInicial = 0
            var repeticao = altura
        }
        let contador = 0;
        for (let i = 0; i < repeticao; i++) {
            let indice = pontoInicial + (largura * i) + i
            var casaPlayer = document.getElementById(indice).getAttribute('player')
            if (casaPlayer == player) {
                contador++
            }
            else {
                contador = 0
            }
            if (contador == 4) {
                audio.play();
                ApresentaMensagem(player);
                return player;
            }
        }
    }
    function verificaDiagonalSecundaria(player, X, Y) {
        var diagonal = X + Y - (altura - 1)
        if (diagonal < 0) {
            var pontoInicial = tabuleiro - largura + (largura * diagonal)
            var repeticao = altura + diagonal
        } else if (diagonal > 0) {
            var pontoInicial = tabuleiro - largura + diagonal
            var repeticao = largura - diagonal
        } else {
            var pontoInicial = tabuleiro - largura
            var repeticao = altura
        }
        let contador = 0;
        for (let i = 0; i < repeticao; i++) {
            let indice = pontoInicial - (largura * i) + i
            var casaPlayer = document.getElementById(indice).getAttribute('player')
            if (casaPlayer == player) {
                contador++
            }
            else {
                contador = 0
            }
            if (contador == 4) {
                audio.play();
                ApresentaMensagem(player);
                return player;
            }
        }
    }

    function marcar(player, X) {

        // trazer array campos do back

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
                var Y = altura - (i + 1)
                mostraTabela(ultimoDaAltura, player == 1 ? 2 : 1)
                verificaDirecoes(player, X, Y)
                return false
            }
        }
    }


    function mostraTabela(atual, player) {

        var html = " Vez do Jogador " + player
        tabJog.innerHTML = html

            //setInterval(mostraTabela , 1000)
        var helper =  "<table><tr>";
        for (let i = 0; i < largura; i++) {
            helper += "<td class='playerActionTd'>"
            helper += "<div class='playerAction playerAction" + player + "' onClick='marcar(" + player + "," + i + ")'></div>"
            helper += "</td>"
        }
        helper += "</tr></table>"
        tabHelper.innerHTML = helper

        var html = "<table class='tabelaPrincipal'>"
        for (let i = 0; i < tabuleiro / largura; i++) {
            html += "<tr>"
            for (let j = 0; j < tabuleiro / altura; j++) {
                if (campos[i * largura + j] == 0) {
                    html += "<td> <div player='0' id='" + (i * largura + j) + "' class='white campo'></div>"
                }
                else if (campos[i * largura + j] == 1) {
                    html += "<td> <div player='1' id='" + (i * largura + j) + "' class='red campo'></div>"
                }
                else {
                    html += "<td> <div player='2' id='" + (i * largura + j) + "' class='blue campo'></div>"
                }

                html += "</td>"
            }
            html += "</tr>"
        }
        html += "</table>"
        screen.innerHTML = html

        if (atual != -1) {
            let deslocar = Math.floor(atual / largura) * 100
            document.getElementById(atual).setAttribute("style", "transform: translateY(-" + deslocar + "px);animation: peca 2s forwards'")
        }
    }

