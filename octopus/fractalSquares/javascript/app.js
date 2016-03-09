// contains global variables and utility functions
var app = app || {
  self: this,
  level: 1,
  score: 0,
  lives: 0,
  numTentacles: 4,
  numCoins: 1,
  coinCounter: 0,
  // time at which pauli respawned
  respawnTime: 0,
  pauseTime: 0,
  // number of squares in each tentacle
  limit: 20,
  tentacleAngles: [],
  // keeps track of the direction each tentacle should be moving and by how much
  deltaAngles: [],
  tentacleBaseWidth: 50,
  coins: [],
  bubbles: [],
  // Variables to keep track of if keys are pressed
  northDown: false,
  southDown: false,
  eastDown: false,
  westDown: false,
  // variable to store animation interval
  intervalID: null,
  levelStart: null,
  levelElapsed: null,
  // variable to store starting point of time interval
  lastTime: 0,
  // time between animation frames
  dt: null,
  // returns a number between the two parameters
  randomRange: function(min,max){
    if (min === 0) return Math.random() * max;
    else return min + Math.random() * (max-min);
  },
  //returns a random RGBA value as a string
  returnRandomRGBA: function() {
    return 'rgba(' + Math.floor(this.randomRange(0, 255)) + ',' + Math.floor(this.randomRange(0, 255)) +
    ',' + Math.floor(this.randomRange(0, 255)) + ',' + Math.random() + ')';
  },
  onKeyDown: function(evt) {

    switch (evt.keyCode) {
      case 37:
        app.westDown = true;
        break;
      case 38:
        evt.preventDefault();
        app.northDown = true;
        break;
      case 39:
        app.eastDown = true;
        break;
      case 40:
        evt.preventDefault();
        app.southDown = true;
        break;
      case 87:
        app.northDown = true;
        break;
      case 65:
        app.westDown = true;
        break;
      case 83:
        app.southDown = true;
        break;
      case 68:
        app.eastDown = true;
        break;
    }
  }, // end keyDown
  onKeyUp: function(evt) {
    switch (evt.keyCode) {
      case 37:
        app.westDown = false;
        break;
      case 38:
        app.northDown = false;
        break;
      case 39:
        app.eastDown = false;
        break;
      case 40:
        app.southDown = false;
        break;
      case 87:
        app.northDown = false;
        break;
      case 65:
        app.westDown = false;
        break;
      case 83:
        app.southDown = false;
        break;
      case 68:
        app.eastDown = false;
        break;
      }
  } // end keyup
}; // end of app object

// begin pauli object
var pauli = {
  width: 17,
  height: 42,
  xPos: 40,
  yPos: 662,
  dx: 0.5,
  dy: -0.5,
  speed: 12,
  drawPauli: function(){
    var image = new Image();
    // image.crossOrigin = "Anonymous";
    image.src = 'img/pauli-sprite.png';
    app.context.drawImage(image, this.xPos, this.yPos);
  },
  updatePosition: function(){
    if (app.northDown && this.dy <= 5) this.dy -= (this.speed * app.dt);
    if (app.southDown && this.dy <= 5) this.dy += (this.speed * app.dt);
    if (app.eastDown  && this.dx <= 5) this.dx += (this.speed * app.dt);
    if (app.westDown  && this.dx <= 5) this.dx -= (this.speed * app.dt);
    // Bounce pauli off the edges of the screen
    if (this.xPos + this.width + this.dx > app.width){
      this.dx *= -0.2;
      // this.xPos = app.width;
    } else if (this.xPos + this.dx < 0) {
      this.dx *= -0.2;
      // this.xPos = 0;
    } else if (this.yPos + this.width + this.dy > app.width) {
      this.dy *= -0.2;
      // this.yPos = app.width;
    } else if (this.yPos + this.dy < 0) {
      this.dy *= -0.2;
      // this.yPos = 0;
    }
    // update Pauli's position
    this.xPos += this.dx;
    this.yPos += this.dy;
    this.dx = this.dx / 1.025;
    this.dy = this.dy / 1.025;

  }
} // end pauli object

function Coin(){
  this.dy = 0.5;
  this.yPos = -20;
  // pick a random x position on the screen to start
  this.xPos = app.randomRange(50, 650);
  this.drawCoin = function(){
    app.context.fillStyle = 'orange';
    app.context.beginPath();
    app.context.arc(this.xPos, this.yPos, 10, 0, Math.PI * 2);
    app.context.closePath();
    app.context.fill();
  },
  this.updatePosition = function(){
    this.yPos += this.dy;
    if (this.yPos > app.width + 20){
      app.coins.splice(app.coins.indexOf(this), 1)
    }
  }
}

function Bubble(){
  this.xPos = pauli.xPos;
  this.yPos = pauli.yPos;
  this.dy = -0.7;
  this.dx = 0.2;
  this.drawBubble = function(){
    app.context.strokeStyle = 'rgba(0,0,0,0.3)';
    app.context.beginPath();
    app.context.arc(this.xPos, this.yPos, 2, 0, Math.PI * 2);
    app.context.closePath();
    app.context.stroke();
  }
  this.updatePosition = function(){
    this.yPos += this.dy;
    this.xPos += this.dx;
    if (app.intervalID % 200 === 0){
      this.dx *= -1;
    }
    if (this.yPos < 0){
      app.bubbles.splice(app.bubbles.indexOf(this), 1);
    }
  }
}

window.onload = function(){
  app.canvas = document.getElementById('canvas');
  app.context = app.canvas.getContext('2d');
  app.width = canvas.width;
  app.displayTime = document.querySelector('#game-time');
  app.displayLives = document.querySelector('#lives');
  app.displayScore = document.querySelector('#score');
  app.overlay = document.querySelector('.overlay:last-child');
  app.overlay.style.display = 'inline-block';
  app.overlay.innerHTML = '<h1>Pauli and the Blocktopus</h1>'+
                          '<h3>Press space to play</h3>';
  levelStart();
  window.addEventListener('keydown', app.onKeyDown, true);
  window.addEventListener('keyup', app.onKeyUp, true);
};


function fractalSquares(x, y, sideLength, angle, limit){
  app.context.save();
  app.context.translate(x, y);
  app.context.rotate(angle);
  app.context.fillStyle = 'purple';
  app.context.fillRect(0, 0, sideLength, -sideLength);
  app.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
  app.context.strokeRect(0, 0, sideLength, -sideLength);
  var x0 = 0;
  var y0 = -sideLength;
  var newSide = sideLength * 0.9;
  if (limit > 0){
    fractalSquares(x0, y0, newSide, angle, limit - 1);
  }
  app.context.restore();
}

function drawTentacles(){
  // Set starting point
  var x = (app.width / 2) - (app.tentacleBaseWidth / 2);
  // angle to rotate each new tentacle by
  var angle = -2 * Math.PI / app.numTentacles;
  // clear the screen

  // save our starting point
  app.context.save();
  app.context.translate(x, x);
  // draw all of our tentacles
  for(i = 0; i < app.numTentacles; i++){
    app.context.rotate(angle);
    fractalSquares(0, 0, app.tentacleBaseWidth, app.tentacleAngles[i], app.limit);
    app.tentacleAngles[i] += app.deltaAngles[i];
    // reverse the angle direction if is greater
    if (app.tentacleAngles[i] > Math.PI / 6 ||
        app.tentacleAngles[i] < -Math.PI / 6) {app.deltaAngles[i] = -app.deltaAngles[i]}
  }
  app.context.restore();
}

function collideDetect(){
  var dw = Math.abs(pauli.dx);
  var dh = Math.abs(pauli.dy);
  var x = Math.floor(pauli.xPos);
  var y = Math.floor(pauli.yPos);
  //app.context.fillStyle = 'rgba(0,0,0,0.4)';
  var allRGB = app.context.getImageData(x - dw, y - dh, pauli.width + 2 * dw, pauli.height + 2 * dh);
  //app.context.fillRect(x-dw,y-dh,pauli.width + 2*dw,pauli.height + 2*dh);
  if (allRGB){
    for (var i = 0; i < allRGB.data.length; i += 4){
      // if the current pixel matches the color of the octopus tentacle
      if (allRGB.data[i] === 128 &&
          allRGB.data[i + 1] === 0 &&
          allRGB.data[i + 2] === 128){
            console.log('tentacle hit');
            return true;
          }
    }
  }
  app.coins.forEach(function(coin){
    // if the coin's position is inside pauli's position
    if(x <= coin.xPos && coin.xPos <= x + pauli.width &&
       y <= coin.yPos && coin.yPos <= y + pauli.height){
         console.log('hit coin ' + app.coins.indexOf(coin));
         //remove the coin
         app.coins.splice(app.coins.indexOf(coin), 1);
         app.score += 100;
       }
  })
}


// init sets pauli back to his initial position and draws the rest of the screen
function init() {
  app.bubbles = [];
  app.respawnTime = Date.now();
  app.context.clearRect(0, 0, app.width, app.width);
  pauli.xPos = 40;
  pauli.yPos = 662;
  pauli.dx = 0;
  pauli.dy = 0;
  app.coins.forEach(function(coin){
    coin.drawCoin;
  });
  drawTentacles();
  pauli.drawPauli();
}

function startGame(event){
  if (event.keyCode === 32){
    if (app.levelElapsed){
      app.levelStart += Date.now() - app.pauseTime;
    }
    app.overlay.innerHTML = '';
    app.overlay.style.display = 'none';
    init();
    // begin animation
    app.intervalID = requestAnimationFrame(animateLoop);
    // remove the event listener so we don't start mulitple games
    window.removeEventListener('keydown', startGame, true);
  }
}

function levelStart(){
  if (app.level === 1){
    app.lives = 3;
    app.score = 0;
    app.numTentacles = 4;
  }
  app.levelStart = Date.now();
  app.levelElapsed = 0;
  // clear angles
  app.tentacleAngles = [];
  app.deltaAngles = [];
  // initialize tentacle angles
  // tentacles start at a random angle betweeen -Pi/2 and Pi/2
  // all tentacles increment at pi/3000
  app.numCoins += app.level;
  app.numTentacles += 1;
  var deltaAngle = Math.PI / (3000 - 400 * (app.level - 1));
  for (i = 0; i < app.numTentacles; i++){
    app.tentacleAngles.push(app.randomRange(-Math.PI / 12, Math.PI / 12));
    app.deltaAngles.push(deltaAngle);
  }
  // add an event listener to start the game
  window.addEventListener('keydown', startGame, true);
}

function animateLoop() {
  var now = Date.now();
  // update level timer
  app.levelElapsed = (now - app.levelStart) / 1000;
  // time between animation frames
  app.dt = (now - app.lastTime) / 1000;
  app.intervalID = requestAnimationFrame(animateLoop);
  // clear screen
  app.context.clearRect(0, 0, app.width, app.width);
  drawTentacles();
  pauli.drawPauli();
  pauli.updatePosition();
  if((app.intervalID + 300) % 500 === 0 &&
      app.coinCounter <= app.numCoins){
    app.coins.push(new Coin());
    app.coinCounter++;
  }
  if (app.intervalID % (Math.floor(app.randomRange(50,300))) === 0){
    app.bubbles.push(new Bubble());
  }
  app.coins.forEach(function(coin){
    coin.updatePosition();
    coin.drawCoin();
  });
  app.bubbles.forEach(function(bubble){
    bubble.updatePosition();
    bubble.drawBubble();
  });
  // if a collision is detected and pauli respawned more than two seconds ago
  // this also runs collideDetect(), but the function only returns true on
  // tentacle hits, not coin hits
  if(collideDetect() && (now - app.respawnTime) / 1000 > 1){
    app.pauseTime = Date.now();
    // add an event listener to restart the game
    window.addEventListener('keydown', startGame, true);
    // stop the animation
    cancelAnimationFrame(app.intervalID);
    app.overlay.style.display = 'inline-block';
    app.overlay.innerHTML = '<h1>Lives: '+ app.lives +
                            '</h1><h2>Score: ' + app.score +
                            '</h2><h3>Press space to continue</h3>';
    app.context.clearRect(0, 0, app.width, app.width);
    pauli.updatePosition();
    drawTentacles();
    pauli.drawPauli();
    if (app.lives >= 1){
      app.lives--;
      // display lives, level, press space to start again etc.
    } else {
      // display GAMEOVER
      window.removeEventListener('keydown', startGame, true);
      app.level = 1;
      app.overlay.style.display = 'inline-block';
      app.overlay.innerHTML = '<h1>Game Over</h1>' +
                              '<h2>Score: ' + app.score + '</h2>' +
                              '<h3>Press space to play again</h3>';
      levelStart();
      app.coins = [];
      app.bubbles = [];

    }

  }
  // If the level is over (there are no more coins)
  if(app.coins.length === 0 && app.coinCounter > app.numCoins){
    app.overlay.style.display = 'inline-block';
    app.score += (Math.floor(app.levelElapsed) * 10);
    cancelAnimationFrame(app.intervalID);
    // display time bonus score
    // display new level screen
    if (app.level > 7){
      app.overlay.innerHTML = '<h1>You are the winner!</h1>'+
                              '<h4>Time: ' + Math.floor(app.levelElapsed) +
                              ' x 10 = ' + (Math.floor(app.levelElapsed) * 10) + '</h4>' +
                              '<h4>Your Score: ' + app.score + '</h4>' +
                              '<h3>Press space to play again!</h3>';
      app.level = 1;
    } else {
      app.overlay.innerHTML = '<h1>Level ' + app.level + ' complete!</h1>'+
                              '<h4>Time: ' + Math.floor(app.levelElapsed) +
                              ' x 10 = ' + (Math.floor(app.levelElapsed) * 10) + '</h4>' +
                              '<h4>Your Score: ' + app.score + '</h4>' +
                              '<h3>Press space to start level ' + (app.level + 1) + '</h3>';
      app.level++;
    }
    levelStart();
  }
  // endpoint of frame time interval updates to start point
  app.lastTime = now;
  app.displayTime.innerHTML = 'Time:' + Math.floor(app.levelElapsed);
  app.displayScore.innerHTML = 'score: ' + app.score;
  app.displayLives.innerHTML = 'lives: ' + app.lives;
}
