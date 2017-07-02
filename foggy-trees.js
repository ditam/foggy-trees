
var ctx;

function drawTree(x, y) {
  ctx.save();
  // draw base triangle
  ctx.beginPath();
    ctx.moveTo(x, y+100);
    ctx.lineTo(x+25, y);
    ctx.lineTo(x+50, y+100);
  ctx.fill();

  // fill a column below base triangle
  ctx.beginPath();
    ctx.moveTo(x, y+100 -2);
    ctx.lineTo(x, y+1000);
    ctx.lineTo(x+50, y+1000);
    ctx.lineTo(x+50, y+100 -2);
  ctx.fill();

  // draw random branches
  for(var i=5; i<40; i+=2) {
    var maxLength = i*0.5+10;
    var diffX = Math.random()*maxLength;
    var diffY = Math.random()*maxLength;
    // symmetrical branches
    ctx.moveTo(x+25, y+i);
    ctx.lineTo(x+25+diffX, y+i+diffY-5);
    ctx.stroke();
    ctx.moveTo(x+25, y+i);
    ctx.lineTo(x+25-diffX, y+i+diffY-5);
    ctx.stroke();
  }
  ctx.restore();
}

function addFogLayer() {
  ctx.save();
  // TODO: use dynamic window size (also in initial size of canvas)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(0, 0, 1366, 768);
  ctx.restore();
}

// draw a line of trees along the parabola y=-a*(x-hOffset)^2 + vOffset
function drawTreeLine(a, hOffset, vOffset) {
  addFogLayer();
  var color = 'rgb(20, 80, 20)';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  var entryCount = 100;
  var xStep = 30;
  _.range(entryCount).forEach(function(i){
    var treeYPosition = Math.pow(a*(i-hOffset/xStep), 2) + vOffset;
    drawTree(i*xStep, treeYPosition);
  });
}

function draw() {
  var treeLineCount = 25;
  for(var i=0;i<treeLineCount;i++) {
    drawTreeLine(Math.random()*1.5+0.25, Math.random()*1366, i*17+Math.random()*5);
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  ctx = document.getElementById('main-canvas').getContext('2d');
  ctx.lineWidth = 4;
  draw();
});