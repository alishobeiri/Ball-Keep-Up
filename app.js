PIXI.utils.sayHello();
PIXI.INTERACTION_FREQUENCY = 60;

var renderer = PIXI.autoDetectRenderer(512, 512, {
  resolution: 1,
  antialias: true,
  backgroundColor : 0xff0000
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
var text = new PIXI.Container();
var wrapper = new PIXI.Container();

console.log("hello");

PIXI.loader
  .add("soccerball", "images/soccerball.png")
  .add("whitebox", "images/white.png")
  .add("uppersky", "images/uppersky.png")
  .add("lowersky", "images/lowersky.png")
  .load(setup);

var soccerball;
var whitebox;
var gravity = 0.20;
var speedY = -5*(Math.random()) - 5;
var speedX = (Math.random() * 10) - 5;
var score = 0;
var gameOver = false;
var angularVelocity = 0;
var exit = false;

var scoreText = new PIXI.Text("Score: " + score);
scoreText.style = new PIXI.TextStyle({
    fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    fill: "white",
    strokeThickness: 4
});

// To be used for end game text
var style = new PIXI.TextStyle({
  fontFamily: 'Helvetica',
  fontSize: 130,
  fontWeight: 'bold'
});

function setup() {
  stage.interactive = true;

  // Load sprites into game
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

  // Set score text location
  scoreText.x = renderer.width - scoreText.width - 25;
  scoreText.y = renderer.height - scoreText.height - 10;

  // Set soccerball attributes
  soccerball.interactive = true;
  soccerball.scale.set(0.4, 0.4);
  soccerball.anchor.set(0.5, 0.5);
  soccerball.x = renderer.width/2;
  soccerball.y = renderer.width/2;

  soccerball.click = soccerball.tap = function(event) {
    score += 1;

    var clickData = event.data.getLocalPosition(stage);
    var clickDistanceX = soccerball.x - clickData.x;
    var yRatio = clickData.y/(soccerball.y+soccerball.height/2);

    // If click is closer to the bottom of the ball, add more speed

    speedY = (yRatio)*(-12);

    console.log("Y ratio: " + yRatio);

    console.log("Click data: ");
    console.log("Y: " + clickData.y);
    console.log("X: " + clickData.x);
    console.log("Soccerball: ");
    console.log("Y: " + soccerball.y);
    console.log("X: " + soccerball.x);

    // Adjust horizontal ball speed based on which side of ball is clicked
    if (clickDistanceX > 0) {
      speedX = Math.log(clickDistanceX);
      angularVelocity = Math.log(Math.abs(clickDistanceX))/100;
    } else if(clickDistanceX < 0) {
      speedX = -Math.log(Math.abs(clickDistanceX));
      angularVelocity = -Math.log(Math.abs(clickDistanceX))/100;
    } else {
      speedX = 0;
    }

    console.log("angularVelocity: " + angularVelocity);

    // Update the scoreboard value
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

  // Add horizontal and vertical speed to the soccerball
  // Add gravity to the vertical speed
  soccerball.y += speedY;
  soccerball.x += speedX;
  speedY += gravity;
  soccerball.rotation += angularVelocity;

  // If the ball falls outside the screen border begin end screen
  if(soccerball.y >= renderer.height) {
    this.resetSprite();
  }

  // If the ball hits the side walls, reverse it direction
  if(soccerball.x >= renderer.width) {
    this.speedX *= -1;
  } else if (soccerball.x <= 0) {
    this.speedX *= -1;
  }

  // If the ball is on top of the i of Hire me stop it
  if(Math.abs(whitebox.x - soccerball.x) < 5 &&
    Math.abs(whitebox.y - soccerball.y - 10) < 5 &&
    gravity == 0) {
      speedX = 0;
      speedY = 0;
  }

  // We want to render different aspects based on game state
  // stage is for game state, wrapper is for end game text
  if (!gameOver) {
    renderer.render(stage);
  } else {
    renderer.render(wrapper);
  }

}


function resetSprite() {
  if (!gameOver) {
    // Reduce ball size, start it on top of screen and disable clicks
    soccerball.scale.set(0.15, 0.15);
    soccerball.y = -soccerball.height/2;
    soccerball.interactive = false;

    // Define end text and set location
    var endText = new PIXI.Text('Please\nHire \nMe 😁', style);
    endText.anchor.set(0.5, 0.5);
    endText.x = renderer.width/2 - 20;
    endText.y = renderer.height/2 - 25;

    // Set location and dimension for hidden box that ball stops on
    whitebox.anchor.set(0.5, 0.65);
    whitebox.scale.set(0.05, 0.05);
    whitebox.x = endText.x - 95;
    whitebox.y = endText.y - 40;
    whitebox.visible = false;

    // Remove score and clouds
    stage.removeChild(scoreText);
    stage.removeChild(uppersky);
    text.addChild(lowersky);
    text.addChild(endText);
    text.addChild(whitebox);
    wrapper.addChild(text);
    wrapper.addChild(stage);

    gameOver = true;
  } else {
    // Calculate the speed to give to the ball to allow it to reach the i
    // of Hire Me
    xDiff = Math.abs(whitebox.x - soccerball.x);
    yDiff = Math.abs(whitebox.y - soccerball.y - 10);
    speedX = xDiff/50;
    speedY = -yDiff/50;
    if (whitebox.x < soccerball.x) {
      speedX *= -1;
    } else if (whitebox.x > soccerball.x) {
      speedX *= 1;
    }
    angularVelocity = 0;
    gravity = 0;
  }
}
