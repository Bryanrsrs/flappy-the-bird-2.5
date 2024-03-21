const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var END = 0;
var PLAY = 1;
var gameState = PLAY;
var engine, world;
var cano, cano2, bird, backgroundImg, coin, gameOver, muteBtn;
var canoImg, cano2Img, canograndeImg, cano2grandeimg, birdImg, coinImg, gameOverImg;
var canoGrupo, canoGrupo2, bgSound, jumpSound;
var points = 0;
var highscore = 0;

function preload() {
  canoImg = loadImage("./assets/cano1.png");
  cano2Img = loadImage("./assets/cano2.png");
  birdImg = loadImage("./assets/flappy.png");
  coinImg = loadImage("./assets/moeda.png");
  gameOverImg = loadImage("./assets/gameOver.png");
  backgroundImg = loadImage("./assets/background.jpg");
  canograndeImg = loadImage("./assets/cano1-grande.png");
  cano2grandeimg = loadImage("./assets/cano2-grande.png");
  bgSound = loadSound("./assets/bgmusic.mp3");
  jumpSound = loadSound("./assets/jump.wav");
}

function setup() {
  createCanvas(1500, 700);
  engine = Engine.create();
  world = engine.world;
  bird = createSprite(75, 360, 65, 65);
  bird.addImage(birdImg);
  bird.scale = 0.3;
  bird.setCollider("circle", 0, 0, 63);

  gameOver = createSprite(width / 2 - 55, height / 2 - 55, 100, 100);
  gameOver.addImage(gameOverImg);
  gameOver.depth = gameOver.depth + 2
  gameOver.visible = false;

  coinGroup = new Group();
  canoGrupo = new Group();
  canoGrupo2 = new Group();

  muteBtn = createImg("./assets/Mute.png");
  muteBtn.position(1200, 30);
  muteBtn.size(40, 40);
  muteBtn.mouseClicked(mute);
}

function draw() {
  background(0);
  image(backgroundImg, 0, 0, 1500, 700);
  fill(0);
  textSize(20);
  text("Score: " + points, 50, 20, 250, 250);
  text("HighScore: " + highscore, 250, 20, 250, 250);

  if (bird.isTouching(canoGrupo) || bird.isTouching(canoGrupo2)) {
    // tocar som quando o passaro morrer
    gameState = END;
  }

  if (gameState == PLAY) {
    bgSound.play();
    bgSound.setVolume(0.005);
    gameOver.visible = false;
    bird.velocityY += 0.5;
    if (bird.y < 30) {
      bird.y += 2;
    } else if (bird.y > 550) {
      bird.y -= 2;
    }

    if (bird.y > 600) {
      gameState = END;
    }

    if (keyWentDown("W") && bird.y > 45) {
      bird.velocityY = -5;
      jumpSound.play();
    }

    if (points > highscore) {
      highscore = points;
    }
    Fcano1();
    Fcano2();
    coins();
  }

  if (gameState == END) {
    if (keyDown("R")) {
      reset();
    }
    canoGrupo.setVelocityXEach(0);
    canoGrupo2.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    canoGrupo.setLifetimeEach(-1);
    canoGrupo2.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    bird.setVelocity(0, 0);
    gameOver.visible = true;
    fill("black");
    textSize(40);
    text("Pressione 'R' para reiniciar", width / 2 - 275, height / 2);
  }

  push();
  imageMode(CENTER);
  pop();

  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
  drawSprites();
  Engine.update(engine);
}

function Fcano1() {
  if (frameCount % 50 == 0) {
    cano = createSprite(1500, 700, 150, 50);
    cano.debug = false;
    cano.setCollider("rectangle", 0, 0, 350, 1250);
    cano.velocityX = Math.round(random(-5, -9));
    cano.lifetime = width / cano.velocityX;
    canoGrupo.add(cano);
    var soft = Math.round(random(1, 2));
    switch (soft) {
      case 1:
        cano.addImage(canoImg);
        cano.scale = random(0.3, 0.4);
        break;
      case 2:
        cano.addImage(canograndeImg);
        cano.scale = random(0.3, 0.4);
        break;
    }
  }
}

function Fcano2() {
  if (frameCount % 75 == 0) {
    cano2 = createSprite(1500, -5, 150, 50);
    cano2.debug = false;
    cano2.setCollider("rectangle", 0, 0, 350, 1250);
    cano2.velocityX = Math.round(random(-5, -9));
    cano2.lifetime = width / cano2.velocityX;
    canoGrupo2.add(cano2);
    var soft = Math.round(random(1, 2));
    switch (soft) {
      case 1:
        cano2.addImage(cano2Img);
        cano2.scale = random(0.4, 0.5);
        break;
      case 2:
        cano2.addImage(cano2grandeimg);
        cano2.scale = random(0.2, 0.3);
        break;
    }
  }
}

function reset() {
  gameOver.visible = false;
  canoGrupo.destroyEach();
  canoGrupo2.destroyEach();
  coinGroup.destroyEach();
  bird.x = 75;
  bird.y = 360;
  bird.scale = 0.3;
  bird.velocityY = 0;
  points = 0;
  gameState = PLAY;
}

function coins(index) {
  if (frameCount % 30 == 0) {
    coin = createSprite(1500, random(-50, 650));
    coin.velocityX = -5;
    coin.debug = false;
    coin.setCollider("circle", 0, 0, 250);
    coin.lifetime = width / coin.velocityX;
    coin.depth = bird.depth - 1;
    coin.addImage(coinImg);
    coin.scale = random(0.03, 0.1);
    coinGroup.add(coin);
  }

  bird.overlap(coinGroup, function (Collector, Collected) {
    // colocar o som da moeda aqui
    Collected.remove();
    points += 1 + Math.round(random(Collected.scale, Collected.height / 150 + Collected.width / 150));
    console.log("points:" + points);
  });
}

function mute() {
  if (bgSound.isPlaying()) {
    bgSound.stop();
  } else {
    bgSound.play();
  }
} 