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