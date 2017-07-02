
var ctx;

var CONSTANTS = Object.freeze({
  FOG_OPACITY: 0.04,
  TREES_IN_LINE: 30,
  TREE_WIDTH: 50
});

// (max can be omitted, then between 0-min)
function getRandomNumber(min, max) {
  if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }
  return ( Math.random() * (max - min) ) + min;
}

// min inclusive, max exclusive
// (max can be omitted, then between 0-min)
function getRandomInt(min, max) {
  return Math.floor( getRandomNumber(min, max) );
}

function drawTree(x, y) {
  ctx.save();
  // draw base triangle
  ctx.beginPath();
    ctx.moveTo(x, y+100);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH/2, y);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH, y+100);
  ctx.fill();

  // fill a column below base triangle
  ctx.beginPath();
    ctx.moveTo(x, y+100 -2);
    ctx.lineTo(x, y+1000);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH, y+1000);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH, y+100 -2);
  ctx.fill();

  // draw random branches
  for(var i=5; i<40; i+=2) {
    // TODO: ideally this should depend on TREE_WIDTH
    var maxLength = i*0.5+5;
    var diffX = getRandomNumber(maxLength);
    var diffY = getRandomNumber(maxLength);
    // symmetrical branches
    ctx.moveTo(x+CONSTANTS.TREE_WIDTH/2, y+i);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH/2+diffX, y+i+diffY-5);
    ctx.stroke();
    ctx.moveTo(x+CONSTANTS.TREE_WIDTH/2, y+i);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH/2-diffX, y+i+diffY-5);
    ctx.stroke();
  }
  ctx.restore();
}

function addFogLayer() {
  ctx.save();
  // TODO: use dynamic window size (also in initial size of canvas)
  ctx.fillStyle = 'rgba(255, 255, 255, '+ CONSTANTS.FOG_OPACITY +')';
  ctx.fillRect(0, 0, 1366, 768);
  ctx.restore();
}

// draw a line of trees along the parabola y=-a*(x-hOffset)^2 + vOffset
function drawTreeLine(a, hOffset, vOffset) {
  addFogLayer();
  var color = 'rgb(20, 80, 20)';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // TODO: this doesn't need a parameter, it should be calculated to always fill the screen width
  var entryCount = 100;
  var xStep = 30;
  var leftOffset = getRandomInt(CONSTANTS.TREE_WIDTH*1.5, CONSTANTS.TREE_WIDTH*2); // offset so trees always start off-screen
  var previousX = -leftOffset;
  _.range(entryCount).forEach(function(i){
    var treeYPosition = Math.pow(a*(i-hOffset/xStep), 2) + vOffset;
    var xVariance = getRandomInt(-15, 3);
    var currentX = previousX + xStep + xVariance;
    drawTree(currentX, treeYPosition);
    previousX = currentX;
  });
}

function draw() {
  for(var i=0;i<CONSTANTS.TREES_IN_LINE;i++) {
    drawTreeLine(getRandomNumber(0.25, 1.5), getRandomInt(1366), i*getRandomInt(17, 22));
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  ctx = document.getElementById('main-canvas').getContext('2d');
  ctx.lineWidth = 4;
  draw();
});
