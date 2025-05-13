let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let arvores = [];
let passarinho;
let predios = [];
let vulcoes = []; // Array para armazenar os vulcões
let casas = []; // Array para armazenar as casas
let aviao; // Variável para o avião
let arcoiris; // Variável para o arco-íris

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  if (tipoSolo === "vegetacao") {
    gerarArvores();
    arcoiris = new Arcoiris(); // Inicializa o arco-íris no solo com vegetação
  } else if (tipoSolo === "urbanizado") {
    gerarPredios();
    gerarCasas(); // Gera as casas na área urbanizada
  } else if (tipoSolo === "exposto") {
    gerarVulcoes(); // Inicializa os vulcões se o solo for exposto
    gerarArvoresQueimando(); // Gera árvores em chamas no solo exposto
    aviao = new Aviao(); // Inicializa o avião na área de solo exposto
  }
  passarinho = new Passarinho();
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();
  mostrarArvores();
  mostrarPredios();
  mostrarVulcoes(); // Chama a função para mostrar os vulcões
  mostrarCasas(); // Chama a função para mostrar as casas
  if (tipoSolo === "exposto") { // Mostra o avião apenas no solo exposto
    aviao.voar();
    aviao.mostrar();
  }
  if (tipoSolo === "vegetacao") { // Mostra o arco-íris apenas no solo com vegetação
    arcoiris.mostrar();
  }

  passarinho.voar();
  passarinho.mostrar();

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  arvores = [];
  predios = [];
  vulcoes = []; // Reseta os vulcões
  casas = []; // Reseta o array de casas
  if (tipoSolo === "vegetacao") {
    gerarArvores();
    arcoiris = new Arcoiris(); // Inicializa o arco-íris no solo com vegetação
  } else if (tipoSolo === "urbanizado") {
    gerarPredios();
    gerarCasas(); // Gera as casas na área urbanizada
  } else if (tipoSolo === "exposto") {
    gerarVulcoes(); // Inicializa os vulcões se o solo for exposto
    gerarArvoresQueimando(); // Gera árvores em chamas no solo exposto
    aviao = new Aviao(); // Inicializa o avião na área de solo exposto
  }
  passarinho = new Passarinho();
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

function gerarArvores() {
  let numArvores = 5;
  let larguraBaseArvores = 30;
  let alturaMaximaArvores = 50;
  let alturaMinimaArvores = 20;

  for (let i = 0; i < numArvores; i++) {
    let x = random(50, width - 50);
    let y = solo.altura;
    let alturaTronco = random(alturaMinimaArvores, alturaMaximaArvores);
    arvores.push(new Arvore(x, y, alturaTronco));
  }
}

function mostrarArvores() {
  if (tipoSolo === "vegetacao") {
    for (let arvore of arvores) {
      arvore.mostrar();
    }
  } else if (tipoSolo === "exposto") {
    for (let arvore of arvores) {
      arvore.mostrar();
    }
  }
}

class Arvore {
  constructor(x, y, alturaTronco) {
    this.x = x;
    this.y = y;
    this.larguraTronco = 10;
    this.alturaTronco = alturaTronco;
    this.raioCopa = random(15, 25);
    this.corTronco = color(101, 67, 33);
    this.corCopa = color(34, 139, 34);
    this.pegandoFogo = false;
    this.fogoParticles = [];
    this.frutos = []; // Array para armazenar os frutos da árvore
    this.numFrutos = int(random(3, 8)); // Número de frutos por árvore
    this.tamanhoFruto = 6; // Tamanho dos frutos
    this.corFruto = color(255, 0, 0); // Cor vermelha para os frutos
    this.gerarFrutos();
  }

  gerarFrutos() {
    for (let i = 0; i < this.numFrutos; i++) {
      // Posições aleatórias para os frutos dentro da copa da árvore
      let xFruto = this.x + random(-this.raioCopa, this.raioCopa);
      let yFruto = this.y - this.alturaTronco - random(0, this.raioCopa);
      this.frutos.push(new Fruto(xFruto, yFruto, this.tamanhoFruto, this.corFruto));
    }
  }

  mostrar() {
    // Tronco
    let troncoColor = this.corTronco;
    if (this.pegandoFogo) {
      troncoColor = color(199, 0, 0);
    }
    fill(troncoColor);
    rect(this.x - this.larguraTronco / 2, this.y - this.alturaTronco, this.larguraTronco, this.alturaTronco);

    // Copa
    let copaColor = this.corCopa;
     if (this.pegandoFogo) {
       copaColor = color(255, 140, 0);
    }
    fill(copaColor);
    ellipse(this.x, this.y - this.alturaTronco - this.raioCopa / 2, this.raioCopa * 2, this.raioCopa * 1.5);

    if(this.pegandoFogo){
       this.mostrarFogo();
    }
    // Mostrar frutos
    for (let fruto of this.frutos) {
      fruto.mostrar();
    }
  }
  mostrarFogo(){
     for (let i = this.fogoParticles.length - 1; i >= 0; i--) {
      this.fogoParticles[i].mostrar();
      this.fogoParticles[i].atualizar();
      if (this.fogoParticles[i].alpha <= 0) {
        this.fogoParticles.splice(i, 1);
      }
    }
    if (frameCount % 5 === 0) {
      this.fogoParticles.push(new ParticulaFogo(this.x, this.y - this.alturaTronco));
    }
  }
}

class ParticulaFogo {
  constructor(x, y) {
    this.x = x + random(-10, 10);
    this.y = y + random(-10, 10);
    this.size = random(5, 15);
    this.cor = color(255, random(50, 200), 0);
    this.alpha = 255;
    this.velocidadeX = random(-1, 1);
    this.velocidadeY = random(-2, -0.5);
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.alpha -= 5;
    this.size += 0.5;
  }

  mostrar() {
    noStroke();
    fill(this.cor, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class Fruto {
  constructor(x, y, tamanho, cor) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.cor = cor;
  }

  mostrar() {
    fill(this.cor);
    ellipse(this.x, this.y, this.tamanho, this.tamanho);
  }
}


class Passarinho {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, height / 2);
    this.tamanho = 20;
    this.velocidadeX = random(1, 3);
    this.velocidadeY = random(-1, 1);
  }

  voar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    // Fazer o passarinho voltar quando atingir as bordas horizontais
    if (this.x > width - this.tamanho / 2 || this.x < this.tamanho / 2) {
      this.velocidadeX *= -1;
    }

    // Adicionar um pequeno efeito de "flutuação" vertical
    if (random(1) < 0.02) {
      this.velocidadeY *= -1;
    }
  }

  mostrar() {
    fill(255, 255, 0); // Amarelo
    ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.8); // Corpo

    // Asas (simplificadas)
    fill(139, 69, 19); // Marrom
    ellipse(this.x - this.tamanho / 2, this.y - this.tamanho / 4, this.tamanho / 2, this.tamanho / 4);
    ellipse(this.x + this.tamanho / 2, this.y - this.tamanho / 4, this.tamanho / 2, this.tamanho / 4);
  }
}

function gerarPredios() {
  let numPredios = 3;
  for (let i = 0; i < numPredios; i++) {
    let larguraPredio = random(40, 80);
    let alturaPredio = random(80, 150);
    let x = random(50, width - 50 - larguraPredio);
    let y = solo.altura - alturaPredio;
    predios.push(new Predio(x, y, larguraPredio, alturaPredio));
  }
}

function mostrarPredios() {
  if (tipoSolo === "urbanizado") {
    for (let predio of predios) {
      predio.mostrar();
    }
  }
}

class Predio {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = color(100); // Cinza padrão
    this.chamineX = this.x + this.largura * 0.6;
    this.chamineY = this.y - random(10, 20);
    this.larguraChamine = 10;
    this.alturaChamine = 20;
    this.fumaça = [];
    this.emissaoFumaça = 0; // Controla a emissão de fumaça
  }

  mostrar() {
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura);

    // Chaminé
    fill(80);
    rect(this.chamineX - this.larguraChamine / 2, this.chamineY - this.alturaChamine, this.larguraChamine, this.alturaChamine);

    // Mostrar fumaça
    for (let i = this.fumaça.length - 1; i >= 0; i--) {
      this.fumaça[i].mostrar();
      this.fumaça[i].atualizar();
      if (this.fumaça[i].alpha <= 0) {
        this.fumaça.splice(i, 1);
      }
    }

    // Emitir fumaça ocasionalmente e de forma mais intensa
    this.emissaoFumaça += 1;
    if (this.emissaoFumaça >= 15) { // Aumenta a frequência da emissão
      let numParticulas = int(random(3, 6)); // Emite mais partículas por vez
      for (let i = 0; i < numParticulas; i++) {
        this.fumaça.push(new ParticulaFumaça(this.chamineX, this.chamineY - this.alturaChamine));
      }
      this.emissaoFumaça = 0; // Reinicia o contador
    }
  }
}

class ParticulaFumaça {
  constructor(x, y) {
    this.x = x + random(-5, 5);
    this.y = y;
    this.diametro = random(15, 30); // Aumenta o diâmetro da fumaça
    this.velocidadeY = -random(0.5, 1.5);
    this.alpha = 255;
    this.cor = color(0, this.alpha); // Altera a cor para preto
  }

  atualizar() {
    this.y += this.velocidadeY;
    this.alpha -= 2;
    this.cor = color(0, this.alpha); // Mantém a cor preta
    this.diametro += 0.2; // Aumenta a expansão da fumaça
  }

  mostrar() {
    noStroke();
    fill(this.cor);
    ellipse(this.x, this.y, this.diametro);
  }
}

// Nova classe para representar o vulcão
class Vulcao {
  constructor(x, y, larguraBase, altura) {
    this.x = x; // Posição horizontal
    this.y = y; // Posição vertical
    this.larguraBase = larguraBase;
    this.altura = altura;
    this.corBase = color(150, 80, 0); // Marrom
    this.corTopo = color(200, 100, 0); // Marrom mais claro
    this.lava = []; // Array para armazenar as partículas de lava
    this.emissaoLava = 0;
    this.fumaça = []; // Array para armazenar as partículas de fumaça
    this.emissaoFumaça = 0; // Controla a emissão de fumaça
  }

  mostrar() {
    // Base do vulcão
    fill(this.corBase);
    triangle(this.x - this.larguraBase / 2, this.y, this.x + this.larguraBase / 2, this.y, this.x, this.y - this.altura * 0.6);

    // Topo do vulcão
    fill(this.corTopo);
    triangle(this.x - this.larguraBase / 3, this.y - this.altura * 0.6, this.x + this.larguraBase / 3, this.y - this.altura * 0.6, this.x, this.y - this.altura);

    // Mostrar lava
    for (let i = this.lava.length - 1; i >= 0; i--) {
      this.lava[i].mostrar();
      this.lava[i].atualizar();
      if (this.lava[i].alpha <= 0) {
        this.lava.splice(i, 1);
      }
    }

    // Emitir lava ocasionalmente
    this.emissaoLava += 1;
    if (this.emissaoLava >= 10) { // Emite lava com mais frequência
      let numParticulas = int(random(5, 10)); // Emite mais partículas de lava
      for (let i = 0; i < numParticulas; i++) {
        this.lava.push(new ParticulaLava(this.x, this.y - this.altura));
      }
      this.emissaoLava = 0;
    }

    // Mostrar fumaça
    for (let i = this.fumaça.length - 1; i >= 0; i--) {
      this.fumaça[i].mostrar();
      this.fumaça[i].atualizar();
      if (this.fumaça[i].alpha <= 0) {
        this.fumaça.splice(i, 1);
      }
    }

    // Emitir fumaça ocasionalmente
    this.emissaoFumaça += 1;
    if (this.emissaoFumaça >= 20) { // Aumenta a frequência da emissão de fumaça
      let numParticulas = int(random(2, 5)); // Emite mais partículas de fumaça por vez
      for (let i = 0; i < numParticulas; i++) {
        this.fumaça.push(new ParticulaFumaçaVulcao(this.x, this.y - this.altura));
      }
      this.emissaoFumaça = 0; // Reinicia o contador
    }
  }
}

class ParticulaLava {
  constructor(x, y) {
    this.x = x + random(-10, 10);
    this.y = y;
    this.diametro = random(8, 16);
    this.velocidadeX = random(-2, 2);
    this.velocidadeY = random(2, 5);
    this.alpha = 255;
    this.cor = color(255, random(0, 100), 0, this.alpha); // Tons de vermelho e amarelo
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.alpha -= 5; // A lava desaparece mais rápido
    this.diametro += 0.5; // Expande um pouco
  }

  mostrar() {
    noStroke();
    fill(this.cor);
    ellipse(this.x, this.y, this.diametro);
  }
}

class ParticulaFumaçaVulcao {
  constructor(x, y) {
    this.x = x + random(-15, 15);
    this.y = y + random(-10, 0);
    this.diametro = random(20, 40);
    this.velocidadeX = random(-0.5, 0.5);
    this.velocidadeY = -random(1, 3);
    this.alpha = 200;
    this.cor = color(220, 220, 220, this.alpha); // Cor da fumaça: branco acinzentado
  }

  atualizar() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
    this.alpha -= 3; // A fumaça desaparece mais lentamente
    this.diametro += 0.1; // A fumaça se expande ligeiramente
  }

  mostrar() {
    noStroke();
    fill(this.cor);
    ellipse(this.x, this.y, this.diametro);
  }
}


function gerarVulcoes() {
  // Define as posições e tamanhos dos vulcões
  let vulcao1X = width / 3;
  let vulcao2X = (width / 3) * 2;
  let vulcaoY = height - 50;
  let larguraBaseGrande = 120;
  let alturaGrande = 90;

  // Cria os vulcões
  vulcoes.push(new Vulcao(vulcao1X, vulcaoY, larguraBaseGrande, alturaGrande));
  vulcoes.push(new Vulcao(vulcao2X, vulcaoY, larguraBaseGrande, alturaGrande));
}

function mostrarVulcoes() {
  if (tipoSolo === "exposto") {
    for (let vulcao of vulcoes) {
      vulcao.mostrar();
    }
  }
}
function gerarArvoresQueimando() {
  if (tipoSolo === "exposto") {
    for (let arvore of arvores) {
      arvore.pegandoFogo = true;
    }
  }
}

function gerarCasas() {
  let numCasas = 4;
  let larguraCasa = 50;
  let alturaCasa = 60;
  let espacamento = (width - 100) / (numCasas - 1); // Espaçamento entre as casas
  let xInicial = 50; // Posição x da primeira casa
  let y = solo.altura - alturaCasa; // Posição y das casas

  for (let i = 0; i < numCasas; i++) {
    let x = xInicial + i * espacamento;
    casas.push(new Casa(x, y, larguraCasa, alturaCasa));
  }
}

function mostrarCasas() {
  if (tipoSolo === "urbanizado") {
    for (let casa of casas) {
      casa.mostrar();
    }
  }
}

class Casa {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = color(200); // Cor cinza claro
    this.telhadoAltura = 20;
  }

  mostrar() {
    // Corpo da casa
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura);

    // Telhado
    fill(160, 82, 45); // Cor marrom para o telhado
    triangle(
      this.x,
      this.y,
      this.x + this.largura / 2,
      this.y - this.telhadoAltura,
      this.x + this.largura,
      this.y
    );

    // Janela (opcional)
    fill(255); // Branco
    rect(this.x + this.largura / 4, this.y + this.altura / 4, this.largura / 2, this.altura / 4);
  }
}

class Aviao {
  constructor() {
    this.x = -100; // Começa fora da telaà esquerda
    this.y = height / 4; // Altura fixa
    this.comprimento = 80;
    this.altura = 20;
    this.velocidade = 2; // Velocidade constante
    this.cor = color(255, 255, 255); // Branco
  }

  voar() {
    this.x += this.velocidade;
    if (this.x > width + 100) { // Sai da tela à direita
      this.x = -100; // Reinicia da esquerda
    }
  }

  mostrar() {
    fill(this.cor);
    // Corpo do avião
    rect(this.x, this.y, this.comprimento, this.altura);
    // Asa
    triangle(
      this.x + this.comprimento,
      this.y,
      this.x + this.comprimento + 30,
      this.y - 10,
      this.x + this.comprimento + 30,
      this.y + 10
    );
    // Cauda
    triangle(
      this.x,
      this.y + this.altura / 2,
      this.x - 10,
      this.y,
      this.x - 10,
      this.y + this.altura
    );
  }
}

class Arcoiris {
  constructor() {
    this.x = -width / 2; // Começa à esquerda da tela
    this.y = height / 4; // Posição vertical no céu
    this.raio = width * 0.7; // Raio para abranger a largura da tela
    this.cores = [
      color(255, 0, 0),    // Vermelho
      color(255, 127, 0),  // Laranja
      color(255, 255, 0),  // Amarelo
      color(0, 255, 0),    // Verde
      color(0, 0, 255),    // Azul
      color(75, 0, 130),   // Anil
      color(148, 0, 211)   // Violeta
    ];
    this.larguraArco = 10;
    this.velocidade = 1; // Velocidade de movimento
  }

  mostrar() {
    noFill();
    strokeWeight(this.larguraArco);
    for (let i = 0; i < this.cores.length; i++) {
      stroke(this.cores[i]);
      // Desenha arcos concêntricos
      arc(this.x, this.y, this.raio * 2 - i * this.larguraArco, this.raio * 2 - i * this.larguraArco, PI + QUARTER_PI, TWO_PI - QUARTER_PI);
    }
    this.x += this.velocidade; // Move o arco-íris horizontalmente
    if (this.x > width * 1.5) { // Reinicia a posição
      this.x = -width / 2;
    }
  }
}
