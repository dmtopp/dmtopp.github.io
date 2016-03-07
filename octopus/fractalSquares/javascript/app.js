// returns a number between the two parameters
function randomRange(min,max){
  if (min === 0) return Math.random() * max;
  else return min + Math.random()*(max-min);
}

function returnRandomRGBA() {
  return 'rgba('+Math.floor(randomRange(0,255))+','+Math.floor(randomRange(0,255))+
  ','+Math.floor(randomRange(0,255))+','+Math.random()+')';
}



function fractalSquares(x,y,sideLength,angle,limit){
  // get our canvas
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.save();
  context.translate(x,y);
  context.rotate(angle);
  context.fillStyle = 'purple';
  context.fillRect(0,0,sideLength,-sideLength);
  context.fillRect(x,y,sideLength,sideLength);
  var x0 = 0;
  var y0 = -sideLength;
  var newSide = sideLength * 0.9;
  if (limit > 0){
    fractalSquares(x0,y0,newSide,angle,limit - 1);
  }
  context.restore();
}

function drawTentacles(sideLength,numTentacles,limit){
  // Set up canvas
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var x = (width/2)-(sideLength/2);
  // angle to rotate each new tentacle by
  var angle = -2*Math.PI/numTentacles;
  // clear the screen
  context.clearRect(0,0,width,width);
  // save our starting point
  context.save();
  context.translate(x,x);
  // draw all of our tentacles
  for(i=0; i < numTentacles; i++){

    context.rotate(angle);
    fractalSquares(0,0,sideLength,arrayOfStartingAngles[i],limit);
    arrayOfStartingAngles[i] += deltaAngles[i];
    if (arrayOfStartingAngles[i] > Math.PI/6 ||
        arrayOfStartingAngles[i] < -Math.PI/6) {deltaAngles[i] = -deltaAngles[i]}
  }
  context.restore();
}


var numTentacles = 30;
// array of random starting angles for each of our tentacles
var arrayOfStartingAngles = [];
// keeps track of the direction each tentacle should be moving and by how much
var deltaAngles = [];
// tentacles start at a random angle betweeen -Pi/2 and Pi/2
// all tentacles increment at pi/1000
for (i=0; i < numTentacles; i++){
  arrayOfStartingAngles.push(randomRange(-Math.PI/12,Math.PI/12));
  deltaAngles.push(Math.PI/1000);
}







function animateLoop() {
  drawTentacles(50,numTentacles,20);
}



window.onload = function(){
  var intervalID = window.setInterval(animateLoop, 50);
};
