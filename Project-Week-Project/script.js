// Dale Sanchez & Dylan Ignacio

let backgroundColor; 
let playerX, playerY, playerV, playerW, playerH;
let invaderX, invaderY, invaderV, invaderArr, iBullets;
let bulletX, bulletY, bulletV, bulletW, bulletH, tempBullet, bulletArr, bulletShot;
let shieldHP, shieldW, shieldH, shieldY, shieldX, shield2X, shield3X, shield2HP, shield3HP;
let gameIsOver, score, highScore, lives;
let classifierSound;
let label = "listening...";
let soundModel = "https://teachablemachine.withgoogle.com/models/YENXtQOQb/";

function preload(){
  classifierSound = ml5.soundClassifier(soundModel + "model.json");
}

function classifySound(){
  classifierSound.classify(gotResultsSound);
}


function setup() {
  createCanvas(600,600);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 5;
  //Game UI Variables
  lives = 3;
  score = 0;
  highScore = 0;
  gameIsOver = false;
  // Player Spaceship variables
  playerX = width / 2;
  playerY = height - 50;
  playerW = 25;
  playerH = 25;
  playerV = 5;
  // Bullet Variables
  bulletY = height - 50;
  bulletW = 5;
  bulletH = 15;
  bulletV = 10;
  bulletArr = [];
  bulletShot = false;
  //Shields
  shieldW = 100;
  shieldH = 30;
  shieldY = height - 100;
  shieldX = 50;
  shield2X = 250;
  shield3X = 450;
  shieldHP = 10;
  shield2HP = 10;
  shield3HP = 10;
  // Creating Invaders
  invaderX = 50;
  invaderY = 100;
  invaderArr = [];
  for(let i = 0; i < 39; i++) {
    invaderArr.push(new Invaders());
    invaderX += 40;
    if(i == 12) {
      invaderX = 50;
      invaderY = 150;
    }
    if (i == 25){
      invaderX = 50;
      invaderY = 200;
    }
  }
  //Sound 
  classifySound();
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(backgroundColor);
  if(!gameIsOver){
    //Text
    text("Score: " + score, 20, 20);
    text("Lives: " + lives, 260, 20);
    text("Highscore: " + highScore, 500, 20);
    //Shields
    fill(130, 100, 87);
    shield(shieldHP, shield2HP, shield3HP);
    rect(shieldX, shieldY, shieldW, shieldH);
    rect(shield2X, shieldY, shieldW, shieldH);
    rect(shield3X, shieldY, shieldW, shieldH);
    fill(244, 97, 8);
    textSize(14);
    text("HP: " + shieldHP, shieldX + 25, shieldY + 20);
    text("HP: " + shield2HP, shield2X + 25, shieldY + 20);
    text("HP: " + shield3HP, shield3X + 25, shieldY + 20);
    //Player
    fill(130, 100, 87);
    rect(playerX, playerY, playerW, playerH);
    movement();
    shoot();
    

    //Invaders
    for(let i = 0; i < invaderArr.length; i++) {
      invaderArr[i].display();
    }
    iBullets = [];
    bulletArr[0].checkCollisions();
  }
  if(lives === 0){
    gameIsOver = true;
    backgroundColor = 95;
    background();
    text("Game Over!", 20, 20); // temp placeholder, chang later
  }

}

class Invaders {
  constructor() {
    this.x = invaderX;
    this.y = invaderY;
    this.w = 15;
    this.h = 15;
  }

  display() {
    fill(130, 100, 87);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

}

function movement() {
  if(keyIsDown(LEFT_ARROW)){
    playerX -= playerV;
    if(playerX <= 0){
      playerX = 0;
    }
  }
  if(keyIsDown(RIGHT_ARROW)){
    playerX += playerV;
    if(playerX >= width - playerW){
      playerX = width - playerW;
    }
  }
}
/*function shoot(){
  if(keyIsDown(UP_ARROW)){
    tempBullet = playerX;
    bulletX = tempBullet;
  }
  fill(130, 100, 87);
  rect(bulletX, bulletY , 5, 15);
  bulletY -= bulletV;
)*/

 /*
function shoot() {
  if(keyIsPressed && (keyCode === 32 || keyCode === UP_ARROW)) {
    bulletShot = true;
    console.log("shot");
    tempBullet = playerX;  
    
  }
  if(bulletY > 0 && bulletShot === true) {
    bulletX = tempBullet;
    bulletArr.push(new Bullets(bulletX, bulletY));
    for(let i = 0; i < bulletArr.length; i++) {
      bulletArr[i].display();
    }
    fill(130, 100, 87);
    rect(bulletX, bulletY, 5, 15);
    bulletY -= bulletV;
  }
  else {
    bulletY = height - 50;
    bulletShot = false;
  }
}

class Bullets {
  constructor(bulletX, bulletY) {
    this.x = bulletX;
    this.y = bulletY;
    this.w = bulletW;
    this.y = bulletH;
  }
  display() {
    fill(130, 100, 87);
    rect(bulletX, bulletY, bulletW, bulletH);
  }
}
*/

function shoot() {
  if(keyIsPressed && bulletArr.length < 1 && (keyCode === 32 || keyCode === UP_ARROW)) {
    bulletArr.push(new Bullets(playerX + 10, playerY));
  //  console.log(keyCode ==> ASCI, key ==> ' ', bulletArr.length)
  }
  
  for (let i = 0; i < bulletArr.length; i++) {
    bulletArr[i].display();
    bulletArr[i].y -= bulletV;
    if (bulletArr[i].y < 0) {
      bulletArr.pop();
    }
  }
}

class Bullets {
  constructor(bulletX, bulletY) {
    this.x = bulletX;
    this.y = bulletY;
    this.w = 5;
    this.h = 15;
  }
  
  display() {
    fill(130, 100, 87);
    rect(this.x, this.y, 5, 15);
  }

  checkCollisions() {
    for(let d = 0; d < invaderArr.length; d++) {
      if(collideRectRect(this.x, this.y, this.w, this.h, invaderArr[d].x, invaderArr[d].y, invaderArr[d].w, invaderArr[d].h)) {
        bulletArr.pop();
        invaderArr.splice(d, 1);
      }
    }
  }
}

class IBullet {
  constructor(bulletX, bulletY) {
    this.x = bulletX;
    this.y = bulletY;
  }
  display() {
    fill(130, 100, 87);
    rect(this.x, this.y, 5, 15);
  }
}

function shield(shield1, shield2, shield3){
  if(shield1 <= 0){
    shieldX = (-250);
  }
  if(shield2 <= 0){
    shield2X = (-450);
  }
  if(shield3 <= 0){
    shield3X = (-600);
  }
}

/*
function checkCollisions() { 
  for(let i = 0; i < bulletArr.legnth; i++) {
    console.log("shoot");
    for(let d = 0; d < invaderArr.length; d++) {
      if(collideRectRect(bulletArr[i].x, bulletArr[i].y, bulletArr[i].w, bulletArr[i].h, invaderArr[d].x, invaderArr[d].y, invaderArr[d].w, invaderArr[d].h)) {
        bulletArr.pop();
        invaderArr.splice(d, 1);
      }
    }
  }
}
*/



/*
function shoot() {
  if(keyIsPressed && bulletArr.length < 1 && (keyCode === 32 || keyCode === UP_ARROW)) {
    bulletArr.push(new Bullets(playerX, playerY));
  //  console.log(keyCode ==> ASCI, key ==> ' ', bulletArr.length)
  }
  
  for (let i = 0; i < bulletArr.length; i++) {
    bulletArr[i].display();
    bulletArr[i].y -= bulletV;
    if (bulletArr[i].y < 0 || collision with invader) {
      bulletArr.pop();
    }
  }
}
class Bullets {
  constructor(bulletX, bulletY) {
    this.x = bulletX;
    this.y = bulletY;
  }
  display() {
    fill(130, 100, 87);
    rect(this.x, this.y, 5, 15);
  }
}
*/

function gotResultsSound(error, results){
  if(error){
    console.error(error);
    return;
  }
  label = results[0].label;
  classifySound();
  if(label == "Bang"){
    
  }
}