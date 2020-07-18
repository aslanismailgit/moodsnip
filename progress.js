const canvasProgress = document.getElementById('canvas_progress');
const ctxProgress = canvasProgress.getContext('2d');

cpw = canvasProgress.width
cph = canvasProgress.height
wid = (cpw-numberOfIter) / numberOfIter

function drawRectangleProgress() {

    ctxProgress.beginPath()
    ctxProgress.lineWidth = "10";
    ctxProgress.strokeStyle = "#e6ffff"
    ctxProgress.rect(start*wid, 1 ,wid, cph-5)
    ctxProgress.stroke()

    ctxProgress.fillStyle = '#F0E68C';
    ctxProgress.fillRect (start*wid, 1 ,wid, cph-5 )

}
