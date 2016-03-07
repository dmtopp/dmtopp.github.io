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
  console.log('drew one!');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var x = (width/2)-(sideLength/2);
  var angle = -2*Math.PI/numTentacles;
  context.clearRect(0,0,width,width);
  context.save();
  context.fillRect(x,x,sideLength,sideLength);
  context.translate(x,x);
  for(i=0; i < numTentacles; i++){
    context.translate(0,sideLength);
    context.rotate(angle);
    fractalSquares(0,0,sideLength,arrayOfStartingAngles[i],limit);
    arrayOfStartingAngles[i] += deltaAngles[i];
    if (arrayOfStartingAngles[i] > Math.PI/12 ||
        arrayOfStartingAngles[i] < -Math.PI/12) {deltaAngles[i] = -deltaAngles[i]}
  }
  context.restore();
}



var numTentacles = 14;
var arrayOfStartingAngles = [];
var deltaAngles = [];
for (i=0; i < numTentacles; i++){
  arrayOfStartingAngles.push(randomRange(-Math.PI/12,Math.PI/12));
  deltaAngles.push(Math.PI/1000);
}


function init(){
  return setInterval(console.log('hi'),10);
}


var intervalID = window.setInterval(myCallback, 50);

function myCallback() {
  drawTentacles(50,numTentacles,20);
}



window.onload = function(){
  // var canvas = document.getElementById('canvas');
  // var context = canvas.getContext('2d');
  // context.fillRect(275,275,50,50);
  // context.translate(275,275);
  // for(i=0; i <4; i++){
  //   context.translate(0,50);
  //   context.rotate(-Math.PI/2);
  //   fractalSquares(0,0,50,randomRange(-Math.PI/18,Math.PI/18),50);
  // }


  init();

};
