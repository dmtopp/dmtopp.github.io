// contains global variables and utility functions

var app = app || {
  self: this,
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
    console.log('keydown');
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
  },
  onKeyUp: function(evt) {
    console.log('keyup')
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
  }

};

var pauli = {
  xPos: 40,
  yPos: 662,
  headRadius: 7,
  bodyLength: 28,
  bodyWidth: 10,
  dx: 0,
  dy: 3,
  drawPauli: function(){
    app.context.fillStyle = 'orange';
    app.context.beginPath();
    app.context.arc(this.xPos+20,this.yPos,10,0,Math.PI*2);
    app.context.closePath();
    app.context.fill();
    app.context.fillStyle = 'black';
    app.context.fillRect(this.xPos+15,this.yPos+10,10,28);
  }
}






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












function animateLoop() {
  app.context.clearRect(0,0,app.width,app.width);
  drawTentacles();
  pauli.drawPauli();
  if (app.northDown) pauli.dy -= 7;
  if (app.southDown) pauli.dy += 7;
  if (app.eastDown) pauli.dy += 7;
  if (app.westDown) pauli.dy -= 7;
  // If pauli is going to go off the screen, don't move pauli
  if (pauli.xPos + pauli.dx > app.width ||
      pauli.xPos + pauli.dy < 0) pauli.dx = 0;
  else if (pauli.yPos + pauli.dy > app.width ||
           pauli.yPos + pauli.dy < 0) pauli.dy = 0;
  // update Pauli's position
  pauli.xPos += pauli.dx;
  pauli.yPos += pauli.dy;
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
    app.deltaAngles.push(Math.PI/1000);
  }

  var intervalID = window.setInterval(animateLoop, 50);
  window.addEventListener('keydown',app.onKeyDown,true);
  window.addEventListener('keyup',app.onKeyUp,true);
};
