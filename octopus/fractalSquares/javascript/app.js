var app = app || {
  numTentacles: 4,
  // number of squares in each tentacle
  limit: 20,
  tentacleAngles: [],
  // keeps track of the direction each tentacle should be moving and by how much
  deltaAngles: [],
  tentacleBaseWidth: 50,
  pauli: {
    xPos: 40,
    yPos: 658,
    headRadius: 7,
    bodyLength: 28,
    bodyWidth: 10,
    drawPauli: function
  },
  // returns a number between the two parameters
  randomRange: function(min,max){
    if (min === 0) return Math.random() * max;
    else return min + Math.random()*(max-min);
  },
  //returns a random RGBA value as a string
  returnRandomRGBA: function() {
    return 'rgba('+Math.floor(this.randomRange(0,255))+','+Math.floor(this.randomRange(0,255))+
    ','+Math.floor(this.randomRange(0,255))+','+Math.random()+')';
  }
};








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
  app.context.clearRect(0,0,app.width,app.width);
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
  drawTentacles();
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
};
