PIXI.utils.sayHello();
PIXI.INTERACTION_FREQUENCY = 60;

var renderer = PIXI.autoDetectRenderer(512, 512, {
  resolution: 1,
  backgroundColor : 0xff0000
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
var text = new PIXI.Container();
var wrapper = new PIXI.Container();

PIXI.loader
  .add("soccerball", "images/soccerball.png")
  .add("whitebox", "images/white.png")
  .add("uppersky", "images/uppersky.png")
  .add("lowersky", "images/lowersky.png")
  .load(setup);

var soccerball;
var whitebox;
var velocity = 0;
var gravity = 0.005;
var speedY = -5*(Math.random()) - 5;
var speedX = (Math.random() * 10) - 5;
var score = 0;
var scoreText = new PIXI.Text("Score: " + score);
scoreText.style = new PIXI.TextStyle({
    fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    fill: "white",
    strokeThickness: 2
});
var gameBegin = false;
var gameOver = false;
var exit = false;
var style = new PIXI.TextStyle({
  fontFamily: 'Helvetica',
  fontSize: 130,
  fontWeight: 'bold'
});


function setup() {
  stage.interactive = true;

  soccerball = new PIXI.Sprite(
    PIXI.loader.resources["soccerball"].texture
  );

  whitebox = new PIXI.Sprite(
    PIXI.loader.resources["whitebox"].texture
  );

  uppersky = new PIXI.Sprite(
    PIXI.loader.resources["uppersky"].texture
  );

  lowersky = new PIXI.Sprite(
    PIXI.loader.resources["lowersky"].texture
  );

  scoreText.x = renderer.width - scoreText.width - 20;
  // Soccer Ball initialization
  soccerball.interactive = true;
  soccerball.scale.set(0.4, 0.4);
  soccerball.anchor.set(0.5, 1);
  soccerball.x = renderer.width/2;
  soccerball.y = renderer.width/2;


  // Soccer Ball click interactions
  soccerball.click = function() {
    speedY = -12;
    score += 1;
    scoreText.text = "Score: " + score;
  }


  stage.addChild(uppersky);
  stage.addChild(scoreText);
  stage.addChild(soccerball);
  animationLoop();
}


function animationLoop() {
  if (!exit) {
    requestAnimationFrame(animationLoop);
  }

  soccerball.y += this.speedY;
  soccerball.x += speedX;
  this.speedY += this.gravity;

  if(soccerball.y >= renderer.height + soccerball.height/2) {
    this.resetSprite();
  }

  if(soccerball.x >= renderer.width) {
    this.speedX *= -1;
  } else if (soccerball.x <= 0) {
    this.speedX *= -1;
  }

  if(Math.abs(whitebox.x - soccerball.x) < 5 &&
    Math.abs(whitebox.y - soccerball.y + 20) < 5 &&
    gravity == 0) {
      speedX = 0;
      speedY = 0;
  }

  if (!gameOver) {
    renderer.render(stage);
  } else {
    renderer.render(wrapper);
  }

}


function resetSprite() {

  if (!gameOver) {
    soccerball.scale.set(0.15, 0.15);
    soccerball.y = -soccerball.height/2;
    soccerball.interactive = false;
    var endText = new PIXI.Text('Please\nHire \nMe 😁', style);
    endText.anchor.set(0.5, 0.5);
    endText.x = renderer.width/2 - 20;
    endText.y = renderer.height/2 - 25;

    whitebox.anchor.set(0.5, 0.65);
    whitebox.scale.set(0.05, 0.05);
    whitebox.x = endText.x - 95;
    whitebox.y = endText.y - 40;
    whitebox.visible=false;


    stage.removeChild(scoreText);
    stage.removeChild(uppersky);
    text.addChild(lowersky);
    text.addChild(endText);
    text.addChild(whitebox);
    wrapper.addChild(text);
    wrapper.addChild(stage);
    gameOver = true;
  } else {
    xDiff = Math.abs(whitebox.x - soccerball.x);
    yDiff = Math.abs(whitebox.y - soccerball.y + 20);
    speedX = xDiff/50;
    speedY = -yDiff/50;
    if (whitebox.x < soccerball.x) {
      speedX *= -1;
    } else if (whitebox.x > soccerball.x) {
      speedX *= 1;
    }

    gravity = 0;
  }
}







/// Blank comment to stop atom glitch
