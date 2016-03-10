var canvas;
var context;
var colors = ['rgba(206,189,204,1)','rgba(142,135,155,1)','rgba(152,131,125,1)'];
var colors2 = ['rgba(186,159,184,1)','rgba(122,145,135,1)','rgba(142,131,125,1)'];
var colors3 = ['rgba(226,229,214,1)','rgba(182,165,175,1)','rgba(182,171,175,1)'];

window.onload = function(){
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  var width = canvas.width;
  squares(0,700,500,700,10,25,'brown',6000);
}

function randomRange(min,max){
  if (min === 0) return Math.random() * max;
  else return min + Math.random() * (max-min);
}

function squares(xMin,xMax,yMin,yMax,minLength,maxLength,color,numSquares){
  // context.fillStyle = colors[Math.floor(Math.random()*2)];
  context.strokeStyle = 'rgba(0,0,0,0.2)';

  for (var i = 0; i <= numSquares; i++){
    context.fillStyle = colors3[Math.floor(Math.random()*3)];
    var sideLength = randomRange(minLength,maxLength);
    var x = randomRange(200,700);
    var y = randomRange((-0.2) * x + 550, yMax);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }

  for (var i = 0; i <= numSquares; i++){
    context.fillStyle = colors[Math.floor(Math.random()*3)];
    var sideLength = randomRange(minLength,maxLength);
    var x = randomRange(xMin,xMax);
    var y = randomRange((0.5) * x + 400, yMax);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }
  for (var i = 0; i <= numSquares / 3; i++){
    context.fillStyle = colors2[Math.floor(Math.random()*3)];
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
    var y = randomRange(695,700);
    context.fillRect(x,y,sideLength,-sideLength);
    context.strokeRect(x,y,sideLength,-sideLength);
  }
  for (var i = 0; i <= 7; i++){
    context.fillStyle = 'rgba(72,128,29,1)';
    var x = randomRange(0,700);
    var y = randomRange((0.5) * x + 400, 650);
    var sideLength = 10;
    for (var j = 0; j <= 7; j++){
      context.fillRect(x,y,sideLength,sideLength);
      context.strokeStyle = 'rgba(0,0,0,0.2)';
      context.strokeRect(x,y,sideLength,sideLength);
      if (j % 2 === 0){
        x += sideLength;
        y -= sideLength;
      } else {
        x -= sideLength;
        y -= sideLength;
      }
    }
  }
  // context.lineWidth = 0.5;
  // context.strokeStyle = 'rgba(0,0,0,1)';
  // context.fillStyle = 'rgba(242,234,7,1)';
  // context.beginPath();
  // context.arc(20, 20, 10, 0, Math.PI * 2);
  // context.closePath();
  // context.fill();
  // context.stroke();
  // context.fillStyle = 'rgba(212,210,217,1)';
  // context.beginPath();
  // context.arc(20, 20, 4, 0, Math.PI * 2);
  // context.closePath();
  // context.fill();
}
