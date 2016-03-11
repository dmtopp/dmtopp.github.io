// contains global variables and utility functions

var app = app || {
  self: this,
  level: 1,
  numTentacles: 4,
  // number of squares in each tentacle
  limit: 20,
  tentacleAngles: [],
  // keeps track of the direction each tentacle should be moving and by how much
  deltaAngles: [],
  tentacleBaseWidth: 50,
  // Variables to keep track of if keys are pressed
  northDown: false,
  southDown: false,
  eastDown: false,
  westDown: false,
  // variable to store animation interval
  intervalID: null,
  // variable to store starting point of time interval
  lastTime: 0,
  // time between animation frames
  dt: null,
  // returns a number between the two parameters
  randomRange: function(min,max){
    if (min === 0) return Math.random() * max;
    else return min + Math.random()*(max-min);
  },
  //returns a random RGBA value as a string
  returnRandomRGBA: function() {
    return 'rgba('+Math.floor(this.randomRange(0,255))+','+Math.floor(this.randomRange(0,255))+
    ','+Math.floor(this.randomRange(0,255))+','+Math.random()+')';
  },
  onKeyDown: function(evt) {
    switch (evt.keyCode) {
      case 37:
        app.westDown = true;
        break;
      case 38:
        app.northDown = true;
        break;
      case 39:
        app.eastDown = true;
        break;
      case 40:
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
  headRadius: 7,
  bodyLength: 28,
  bodyWidth: 10,
  dx: 0.5,
  dy: -0.5,
  speed: 12,
  drawPauli: function(){
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = 'img/pauli-sprite.png';
    app.context.drawImage(image,this.xPos,this.yPos);
    // app.context.fillStyle = 'orange';
    // app.context.beginPath();
    // app.context.arc(this.xPos+20,this.yPos,10,0,Math.PI*2);
    // app.context.closePath();
    // app.context.fill();
    // app.context.fillStyle = 'black';
    // app.context.fillRect(this.xPos+15,this.yPos+10,10,28);
  },
  updatePosition: function(){
    if (app.northDown) this.dy -= (this.speed * app.dt);
    if (app.southDown) this.dy += (this.speed * app.dt);
    if (app.eastDown) this.dx += (this.speed * app.dt);
    if (app.westDown) this.dx -= (this.speed * app.dt);
    // If pauli is going to go off the screen, don't move pauli
    if (this.xPos + this.dx > app.width){
      this.dx *= -1;
      // this.xPos = app.width;
    } else if (this.xPos + this.dy < 0) {
      this.dx *= -1;
      // this.xPos = 0;
    } else if (this.yPos + this.dy > app.width) {
      this.dy *= -1;
      // this.yPos = app.width;
    } else if (this.yPos + this.dy < 0) {
      this.dy *= -1;
      // this.yPos = 0;
    }
    // update Pauli's position
    this.xPos += this.dx;
    this.yPos += this.dy;
    // if (this.dx > 3) this.dx -= 1.5;
    // else if (this.dx < -3) this.dx += 1.5;
    // else if (this.dy > 3) this.dy -= 1.5;
    // else if (this.dy < 3) this.dy += 1.5;

  }
} // end pauli object






function fractalSquares(x,y,sideLength,angle,limit){
  app.context.save();
  app.context.translate(x,y);
  app.context.rotate(angle);
  app.context.fillStyle = 'purple';
  app.context.fillRect(0,0,sideLength,-sideLength);
  app.context.fillRect(x,y,sideLength,sideLength);
  var x0 = 0;
  var y0 = -sideLength;
  var newSide = sideLength * 0.9;
  if (limit > 0){
    fractalSquares(x0,y0,newSide,angle,limit - 1);
  }
  app.context.restore();
}

function drawTentacles(){
  // Set starting point
  var x = (app.width/2)-(app.tentacleBaseWidth/2);
  // angle to rotate each new tentacle by
  var angle = -2*Math.PI/app.numTentacles;
  // clear the screen

  // save our starting point
  app.context.save();
  app.context.translate(x,x);
  // draw all of our tentacles
  for(i=0; i < app.numTentacles; i++){

    app.context.rotate(angle);
    fractalSquares(0,0,app.tentacleBaseWidth,app.tentacleAngles[i],app.limit);
    app.tentacleAngles[i] += app.deltaAngles[i];
    if (app.tentacleAngles[i] > Math.PI/6 ||
        app.tentacleAngles[i] < -Math.PI/6) {app.deltaAngles[i] = -app.deltaAngles[i]}
  }
  app.context.restore();
}

function collideDetect(){
  var dw = Math.abs(pauli.dx);
  var dh = Math.abs(pauli.dy);
  var x = Math.floor(pauli.xPos);
  var y = Math.floor(pauli.yPos);
  //console.log(dw,dh,x,y);
  app.context.fillStyle = 'rgba(0,0,0,0.4)';
  // app.context.fillRect(x-dw, y-dh, pauli.width+2*dw, dh);
  // app.context.fillRect(x-dw, y, dw, pauli.height);
  // app.context.fillRect(x+pauli.width, y, dw, pauli.height);
  // app.context.fillRect(x-dw, y+pauli.height, pauli.width+2*dw, dh);
  // var RGBdata1 = app.context.getImageData(x-dw, y-dh, pauli.width+2*dw, dh);
  // var RGBdata2 = app.context.getImageData(x-dw, y, dw, pauli.height);
  // var RGBdata3 = app.context.getImageData(x+pauli.width, y, dw, pauli.height);
  // var RGBdata4 = app.context.getImageData(x-dw, y+pauli.height, pauli.width+2*dw, dh);
  // var allRGB = [];
  var allRGB = app.context.getImageData(x-dw,y-dh,pauli.width + 2*dw,pauli.height + 2*dh);
  app.context.fillRect(x-dw,y-dh,pauli.width + 2*dw,pauli.height + 2*dh);
  // RGBdata1.data.forEach(function(item){allRGB.push(item)});
  // RGBdata2.data.forEach(function(item){allRGB.push(item)});
  // RGBdata3.data.forEach(function(item){allRGB.push(item)});
  // RGBdata4.data.forEach(function(item){allRGB.push(item)});
  for (var i = 0; i < allRGB.data.length; i+=4){
    if (allRGB.data[i] === 128 &&
        allRGB.data[i+1] === 0 &&
        allRGB.data[i+2] === 128){
          console.log('hit');
          return true;
        }
  }
}


function animateLoop() {
  var now = Date.now();
  app.dt = (now - app.lastTime)/1000;

  app.intervalID = requestAnimationFrame(animateLoop);
  app.context.clearRect(0,0,app.width,app.width);
  drawTentacles();
  pauli.drawPauli();
  pauli.updatePosition();
  collideDetect();
  app.lastTime = now;
  var displayDt = document.querySelector('#dt');
  var displayDx = document.querySelector('#dx');
  var displayDy = document.querySelector('#dy');
  displayDt.innerHTML = 'dt:' + app.dt;
  displayDx.innerHTML = 'dx:' + pauli.dx;
  displayDy.innerHTML = 'dy:' + pauli.dy;
}

window.onload = function(){
  app.canvas = document.getElementById('canvas');
  app.context = app.canvas.getContext('2d');
  app.width = canvas.width;
  // initialize tentacle angles
  // tentacles start at a random angle betweeen -Pi/2 and Pi/2
  // all tentacles increment at pi/1000
  for (i=0; i < app.numTentacles; i++){
    app.tentacleAngles.push(app.randomRange(-Math.PI/12,Math.PI/12));
    app.deltaAngles.push(Math.PI/3000);
  }
  app.intervalID = requestAnimationFrame(animateLoop);
  window.addEventListener('keydown',app.onKeyDown,true);
  window.addEventListener('keyup',app.onKeyUp,true);
};
