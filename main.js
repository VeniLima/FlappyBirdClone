// Cria nosso 'main' state que vai conter o jogo
let mainState = {
  preload: function () {
    // Essa função sera executada no começo  
    // É onde carregamos as imagens e sons...

    game.load.image('bird', 'assets/bird.png'); // Sprite do pássaro

    game.load.image('pipe', 'assets/pipe.png'); // Sprite do obstáculo

    game.load.audio('jump', 'assets/jump.wav');  // Som de pulo
  },

  create: function () {
    // Essa função é chamada após o preload    
    // Aqui nos configuramos o jogo, exibimos sprites, etc.  

    game.stage.backgroundColor = '#71c5cf'; // Muda a cor de fundo para azul

    game.physics.startSystem(Phaser.Physics.ARCADE); // Define o sistema de física

    this.bird = game.add.sprite(100, 245, 'bird'); // Mostra o pássaro na posição x=100 e y=245

    game.physics.arcade.enable(this.bird); // Adiciona física ao pássaro

    this.bird.body.gravity.y = 1000; // Adiciona gravidade no pássaro pra fazer ele cair

    let spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR // Chama a função 'jump' quando a tecla espaço for pressionada
    );
    spaceKey.onDown.add(this.jump, this);

    this.pipes = game.add.group(); // Grupo de obstáculos

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); // Chama a função de criar obstáculos

    this.score = -1;
    this.labelScore = game.add.text(20, 20, "0",
      { font: "30px Arial", fill: "#ffffff" }); // Score do jogo

    this.bird.anchor.setTo(-0.2, 0.5); // Move o centro da rotação do pássaro

    this.jumpSound = game.add.audio('jump'); // Adiciona som ao pulo
  },

  update: function () {
    // Essa função é chamada 60 vezes por segundo    
    // Contem a lógica do jogo

    if (this.bird.y < 0 || this.bird.y > 490) {
      this.restartGame(); // Se o pássaro estiver fora da tela, chama a função 'restartGame'
    }

    game.physics.arcade.overlap(
      this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.angle < 20)
      this.bird.angle += 1;
  },

  jump: function () {
    if (this.bird.alive == false)
      return;
    this.bird.body.velocity.y = -350; // Adiciona velocidade vertical ao pássaro

    // Cria a animação no pássaro
    let animation = game.add.tween(this.bird);

    // Muda o ângulo do pássaro -20° em 100 ms
    animation.to({ angle: -20 }, 100);

    // e inicia a animação
    animation.start();

    this.jumpSound.play();
  },

  restartGame: function () {
    game.state.start('main'); // Começa o 'main' state, que reinicia o jogo
  },

  addOnePipe: function (x, y) {
    // Cria um obstáculo na posição x, y
    let pipe = game.add.sprite(x, y, 'pipe');

    // Cria obstáculos no grupo de obstáculos 
    this.pipes.add(pipe);

    // Ativa física no obstáculo
    game.physics.arcade.enable(pipe);

    // Add velocidade para se mover pra esquerda
    pipe.body.velocity.x = -200;

    // Destrói o obstáculo quando não estiver visível
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function () {
    // Aleatoriamente seleciona um numero entre 1 e 5
    // Posição do buraco no obstáculo
    let hole = Math.floor(Math.random() * 5) + 1;
    this.score += 1; // Progride o Score
    this.labelScore.text = this.score;

    // Adiciona os 6 obstáculos
    // Com um espaço na posição 'hole' e 'hole + 1'
    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);
  },

  hitPipe: function () {
    // Se o pássaro ja atingiu um obstáculo, retorna nada
    // Quer dizer que o pássaro já está caindo
    if (this.bird.alive == false)
      return;

    // Define a função alive para falso
    this.bird.alive = false;

    // Previne novos obstáculos de aparecerem
    game.time.events.remove(this.timer);

    // Para o movimento dos obstáculos
    this.pipes.forEach(function (p) {
      p.body.velocity.x = 0;
    }, this);
  },

};

// Inicia o Phaser, e cria um jogo de 400px por 490px
const game = new Phaser.Game(400, 490);

// Adiciona o 'mainState' e o nomeia de 'main'
game.state.add('main', mainState);

// Inicia o state para realmente iniciar o jogo
game.state.start('main');

