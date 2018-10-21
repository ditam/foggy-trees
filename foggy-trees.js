
var canvas, ctx, tempCanvas;

var CONSTANTS = Object.freeze({
  FOG_STRENGTH: 0.12, // between 0-1
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
    ctx.moveTo(x+CONSTANTS.TREE_WIDTH/2, y+i);
    ctx.lineTo(x+CONSTANTS.TREE_WIDTH/2-diffX, y+i+diffY-5);
  }
  ctx.stroke();
  ctx.restore();
}

// A layer of fog clouds is added based on a Perlin-noise function
// We could figure out a blending algorithm, but instead we just draw the noise image on an other canvas object,
// then draw it as an image on our original canvas.
function addFogLayer() {
  noise.seed(Math.random());
  var tempCtx = tempCanvas.getContext('2d');
  var image = tempCtx.createImageData(canvas.width, canvas.height);
  var data = image.data;
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      // All noise functions return values in the range of -1 to 1.
      // Having a bias towards the Y coordinate makes the pattern horizontally stretched, which looks like horizontal clouds
      var value = (noise.perlin2(x/300, y/50) + 1)/2 * 255 * CONSTANTS.FOG_STRENGTH; // number between [0,255]
      var cell = (x + y * canvas.width) * 4;
      data[cell] = data[cell + 1] = data[cell + 2] = 255;
      data[cell + 3] = value; // alpha
    }
  }
  tempCtx.putImageData(image, 0, 0);
  ctx.drawImage(tempCanvas,0,0);
}

// draw a line of trees along the parabola y=-a*(x-hOffset)^2 + vOffset
function drawTreeLine(a, hOffset, vOffset) {
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

  addFogLayer();
}

function draw() {
  for(var i=0;i<CONSTANTS.TREES_IN_LINE;i++) {
    drawTreeLine(getRandomNumber(0.25, 1.5), getRandomInt(1366), i*getRandomInt(17, 22));
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  canvas = document.getElementById('main-canvas');
  tempCanvas=document.createElement('canvas');
  tempCanvas.width=canvas.width;
  tempCanvas.height=canvas.height;
  ctx = canvas.getContext('2d');

  var color = 'rgb(20, 80, 20)';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;

  console.time('drawing');
  draw();
  console.timeEnd('drawing');
});
