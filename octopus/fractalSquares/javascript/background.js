var canvas;
var context;
var colors = ['rgba(166,149,164,1)','rgba(82,75,105,1)','rgba(112,91,85,1)'];

window.onload = function(){
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  var width = canvas.width;
  squares(0,700,500,700,7,15,'brown',6000);
}

function randomRange(min,max){
  if (min === 0) return Math.random() * max;
  else return min + Math.random() * (max-min);
}

function squares(xMin,xMax,yMin,yMax,minLength,maxLength,color,numSquares){
  // context.fillStyle = colors[Math.floor(Math.random()*2)];
  context.strokeStyle = 'rgba(0,0,0,0.4)';
  for (var i = 0; i <= numSquares; i++){
    context.fillStyle = colors[Math.floor(Math.random()*3)];
    var sideLength = randomRange(minLength,maxLength);
    var x = randomRange(xMin,xMax);
    var y = randomRange((0.5) * x + 400, yMax);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }
  for (var i = 0; i <= numSquares / 3; i++){
    context.fillStyle = colors[Math.floor(Math.random()*3)];
    var sideLength = randomRange(minLength,maxLength);
    var x = randomRange(300,700);
    var y = randomRange((-0.5) * x + 850, yMax);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }
  for (var i = 0; i <= numSquares / 2; i++){
    context.fillStyle = 'rgba(80,79,77,1)';
    var sideLength = randomRange(minLength,maxLength);
    var x = randomRange(0,700);
    var y = randomRange(690,700);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }
}
