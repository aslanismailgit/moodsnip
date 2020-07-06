var pics_button = document.getElementById("seePics");
pics_button.addEventListener('click', bringPics);

var pics_Src = document.getElementById("img");

function bringPics(e){
  e.preventDefault();
  console.log("bringing pics");
  pics_Src.src="https://source.unsplash.com/1600x900/?happiness"


}
