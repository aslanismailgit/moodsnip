
var radius = 65;
var eyeRadius = 10;
var eyeXOffset = 25;
var eyeYOffset = 20;
var centerY = 1.2*canvas.height / 3;

function smileyFace(){
  var centerX = canvas.width - (40+radius);

  // draw the yellow circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#7FFF00';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  // draw the eyes
  ctx.beginPath();
  var eyeX = centerX - eyeXOffset;
  var eyeY = centerY - eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  var eyeX = centerX + eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  // draw the mouth
  ctx.beginPath();
  ctx.arc(centerX, centerY, 35*radius/70, 0, Math.PI, false);
  ctx.stroke();
}

function neutralFace(){
  var centerX = canvas.width / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  // draw the eyes
  ctx.beginPath();
  var eyeX = centerX - eyeXOffset;
  var eyeY = centerY - eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  var eyeX = centerX + eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  // draw the mouth
  ctx.beginPath();
  ctx.moveTo(centerX-30, centerY+20);
  ctx.lineTo(centerX+30, centerY+20);
  ctx.stroke();
}
function negativeFace(){
  var centerX = 40+radius;


  // draw the yellow circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  // draw the eyes
  ctx.beginPath();
  var eyeX = centerX - eyeXOffset;
  var eyeY = centerY - eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  var eyeX = centerX + eyeXOffset;
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  // draw the mouth
  ctx.beginPath();
  ctx.arc(centerX, centerY+30, 30*radius/70, 0, Math.PI, true);
  ctx.stroke();
}
