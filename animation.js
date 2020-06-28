const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var canvasWidth = 600
var canvasHeight = 400

canvas.width = canvasWidth
canvas.height = canvasHeight


const circle1 = {
  x: canvasWidth - 550,
  y: canvasHeight - 80,
  size: 20,
};
const circle2 = { // on the right
  x: circle1.x + 500,
  y: circle1.y,
  size: circle1.size,
};

const triangle = {
  center: 300,
  b:300, //to the right
  h:50, // height
  dx:5
}

var please_Wait = true

function pleaseWait() {
  if (please_Wait) {
    ctx.font = "30px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0"," magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Please wait......", 40, 55);
  }
}

var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0"," red");
gradient.addColorStop("0.5", "yellow");
gradient.addColorStop("1.0", "green");

function yourGrade() {
  if (please_Wait==false) {
    ctx.font = "30px Verdana";
    ctx.fillStyle = gradient;
    ctx.fillText("Your are %" + (target*10).toFixed(0)+" positive!", 40, 55);
  }
}

// Triangle
function drawTriangle(){
  ctx.beginPath();
  ctx.moveTo(triangle.center-25, triangle.b);
  ctx.lineTo(triangle.center+25, triangle.b);
  ctx.lineTo((triangle.center), triangle.b -triangle.h);
  ctx.lineTo(triangle.center-25, triangle.b);
  ctx.fillStyle = 'coral';
  ctx.fill();

}

function drowRectangle() {
  ctx.fillStyle = gradient;
  ctx.fillRect (50, 300 ,canvasWidth-100, circle1.size*2 )
}

function drawCircle1() {
  ctx.beginPath();
  ctx.arc(circle1.x, circle1.y, circle1.size, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
}
function drawCircle2() {
  ctx.beginPath();
  ctx.arc(circle2.x, circle2.y, circle2.size, 0, Math.PI * 2);
  ctx.fillStyle = '#228B22';
  ctx.fill();
}

function drawBorder(){
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'red';
  ctx.strokeRect(10, 10, canvasWidth-15, canvasHeight-15);
}

var zigzag = 0
var zigzagStopAt = randomInteger(2, 4)
var wayLength = canvasWidth -100 //- 40 - 40
var ratio = 10
var stopPoint


function triangleUpdate(){
  stopPoint = (target * wayLength /ratio) + (50)
  triangle.center += triangle.dx;
  if (triangle.center + 25 > canvasWidth-(40) || triangle.center - 25 < (40)) {
    zigzag++
    triangle.dx *= -1;
  }
  if (zigzag==zigzagStopAt && (triangle.center < stopPoint+3)&& (triangle.center > stopPoint-3)) {

    triangle.dx *= 0;
    please_Wait = false
    console.log("normal stop", triangle.center);
  }
  if ((target<1) && (zigzag==zigzagStopAt+2)) {
      triangle.dx *= 0;
      please_Wait = false
      console.log("zigzag stop less than 1");
  }
  if ((target>9) && (zigzag==zigzagStopAt+1)) {
      triangle.dx *= 0;
      please_Wait = false
      console.log("zigzag stop bigger than 9");
  }

}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pleaseWait()
  yourGrade()
  drowRectangle()
  drawCircle1()
  drawCircle2()
  drawBorder()
  smileyFace()
  neutralFace()
  negativeFace()
  triangleUpdate()
  drawTriangle()

  requestAnimationFrame(update);
}

// update();
