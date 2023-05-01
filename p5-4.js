/// <reference path="../lib/p5.global.d.ts" />

class Game {
  width = 1000;
  height = 600;
  lives = 3;
  targetRows = 4;
  targetCols = 5;
  background = 200;
  points = 0;
}

class Ball {
  constructor() {
    this.x = random(50, 950);
    this.y = random(200, 400);
    this.vx = random(-1, 1);
    if (this.vx < 0) {
      this.vx = -3;
    } else {
      this.vx = 3;
    }
    this.vy = -3;
    this.size = 50;
    this.radius = this.size / 2;
  }
  draw() {
    fill("red");
    stroke("white");
    circle(this.x, this.y, this.size);
    this.x += this.vx;
    this.y += this.vy;

    this.collideWithWalls();
    this.collideWithPaddle();
    this.collideWithTargets();
  }

  collideWithWalls() {
    if (this.x > 1000 - this.radius || this.x < 0 + this.radius) {
      this.vx = -this.vx;
    }
    if (this.y < 0 + this.radius) {
      this.vy = -this.vy;
    }
    if (this.y > 650 - this.radius) {
      this.x = random(50, 950);
      this.y = random(200, 400);
      this.vx = random(-1, 1);
      if (this.vx < 0) {
        this.vx = -3;
      } else {
        this.vx = 3;
      }
      this.vy = -3;
      game.lives = game.lives - 1;
    }
  }
  collideWithPaddle() {
    if (
      mouseX - paddle.width / 2 < this.x &&
      this.x < mouseX + paddle.width / 2 &&
      this.y > 500 &&
      this.y < 510
    ) {
      this.vy = -this.vy;
    }
  }
  collideWithTargets() {
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (
        this.bottomEdge() > target.topEdge() &&
        this.topEdge() < target.topEdge()
      ) {
        if (
          this.rightEdge() > target.leftEdge() &&
          this.leftEdge() < target.rightEdge()
        ) {
          this.vy = -this.vy;
          targets.splice(i, 1);
          this.vy *= 1.1;
          this.vx *= 1.15;
          game.points += 1;
          ball.size -= 1;
          paddle.width -= 7;
          return;
        }
      }
    }
  }
  topEdge() {
    return this.y - this.radius;
  }
  bottomEdge() {
    return this.y + this.radius;
  }
  leftEdge() {
    return this.x - this.radius;
  }
  rightEdge() {
    return this.x + this.radius;
  }
}

class Paddle {
  constructor() {
    this.y = game.height - 75;
    this.width = 200;
    this.height = 10;
  }
  draw() {
    fill("green");
    stroke("white");
    rect(mouseX - this.width / 2, this.y, this.width, this.height);
  }
  topEdge() {
    return this.y;
  }
  bottomEdge() {
    return this.y + this.height;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
}

class Target {
  constructor(row, col) {
    this.row = row;
    this.col = col;

    this.height = 15;
    this.width = game.width / game.targetCols;
    this.x = this.width * this.row;
    this.y = (120 / game.targetRows) * col + 20;
  }
  draw() {
    fill("blue");
    strokeWeight(2);
    stroke("white");
    rect(this.x, this.y, this.width, this.height);
  }
  topEdge() {
    return this.y + this.height / 2;
  }
  bottomEdge() {
    return this.y + this.height / 2;
  }
  leftEdge() {
    return this.x;
  }
  rightEdge() {
    return this.x + this.width;
  }
}

/** @type {Game} */
let game;
/** @type {Ball} */
let ball;
/** @type {Paddle} */
let paddle;
/** @type {Array<Target>} */
let targets = [];

var setup = function () {
  game = new Game();
  createCanvas(game.width, game.height);
  ball = new Ball();
  paddle = new Paddle();

  for (let across = 0; across < game.targetCols; across++) {
    for (let down = 0; down < game.targetRows; down++) {
      targets.push(new Target(across, down));
    }
  }
};

var draw = function () {
  background(game.background);
  if (game.lives === 0 || targets.length == 0) {
    noLoop();
  }
  paddle.draw();
  ball.draw();
  for (const target of targets) {
    target.draw();
  }
  if (targets.length === 0) {
    game.background = "green";
    fill("white");
    stroke(0);
    textSize(50);
    textAlign(CENTER);
    textFont("Georgia");
    text("You Win!!!", width / 2, height / 2);
    text("Your Score Was: " + game.points, width / 2, height / 2 + 50);
  }
  if (game.lives === 0) {
    game.background = "red";
    fill("white");
    stroke(0);
    textSize(50);
    textAlign(CENTER);
    textFont("Georgia");
    text("You Lose!!!", width / 2, height / 2);
    text("Your Score Was: " + game.points, width / 2, height / 2 + 50);
  }
  if (game.lives > 0) {
    fill("black");
    stroke(0);
    textSize(25);
    textAlign(CENTER);
    textFont("Arial");
    text("Lives Left: " + game.lives, 100, 575);
  }
  if (game.lives > 0) {
    fill("black");
    stroke(0);
    textSize(25);
    textAlign(CENTER);
    textFont("Arial");
    text("Your Score: " + game.points, 875, 575);
  }
};
