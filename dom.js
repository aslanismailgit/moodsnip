
var lang = window.navigator.userLanguage || window.navigator.language;
var language = lang.substring(0, 2);

var Howd = document.getElementById("Howd");
var SelectW = document.getElementById("SelectW");
var Here = document.getElementById("Here");
var YouAre = document.getElementById("YouAre");
var posit = document.getElementById("posit");


var start_button = document.getElementById("start_button");
start_button.addEventListener('click', start_words);

var play_Again = document.getElementById("playAgain");
play_Again.addEventListener('click', playAgain);


if (language=="tr") {
  //console.log("türkçe");
  data = data_tr;
  change2turkish()
}
else  { //(language=="en")
  //console.log("english");
  data = data_en
}

function change2turkish(){
  Howd.innerText = "Acaba Bugün Nasılım"
  SelectW.innerText = "Bir kelime seç ve gör"
  start_button.innerText = "Başla"
  play_Again.innerText = "Yeniden Başla"
  Here.innerText = "İşte sonuçlar"
  YouAre.innerText = "Bugün"
  posit.innerText = "pozitifsiniz"
  //console.log("changed to turkish");
}

 //works IE/SAFARI/CHROME/FF

var lengthOfDictionary = data.length
// console.log("Length of dictionary = ", lengthOfDictionary);

var results = document.getElementById("results");
results.style.display = "none";
var results_chart = document.getElementById("results_chart");
results_chart.style.display = "none";

var chartElem = document.getElementById("container_chart");

/*-------------------------------------------------*/


var button1 = document.getElementById("word_button_1");
button1.addEventListener('click', runSelectWord_1);
button1.disabled = true

var button2 = document.getElementById("word_button_2");
button2.addEventListener('click', runSelectWord_2);
button2.disabled = true

var button3 = document.getElementById("word_button_3");
button3.addEventListener('click', runSelectWord_3);
button3.disabled = true

var button4 = document.getElementById("word_button_4");
button4.addEventListener('click', runSelectWord_4);
button4.disabled = true




var start = 0
var text1 = ""
var text2 = ""
var text3 = ""
var text4 = ""
var index_temp = 0

var totalPositiveScore = 0
var totalNegativeScore = 0
var target = 0


/*-------------------------------------------------*/
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomWordsIndex = []
numberOfIter = 10
var index_ary = new Uint8Array(numberOfIter*4);

min = 0; // min-max included
max = lengthOfDictionary-1;

for (var i = 0; i < numberOfIter*4; i++) {
  randomInt = randomInteger(min, max)
  randomWordsIndex[i] = randomInt
}

/*-------------------------------------------------*/
function assign_words(){
  if (start<numberOfIter) {
    text1 = data[randomWordsIndex[0 + start * 4]]["Word"] //+ "--" + start
    text2 = data[randomWordsIndex[1 + start * 4]]["Word"] //+ "--" + start
    text3 = data[randomWordsIndex[2 + start * 4]]["Word"] //+ "--" + start
    text4 = data[randomWordsIndex[3 + start * 4]]["Word"] //+ "--" + start
    button1.innerText = text1.toLowerCase();
    button2.innerText = text2.toLowerCase();
    button3.innerText = text3.toLowerCase();
    button4.innerText = text4.toLowerCase();

    button1.disabled = false
    button2.disabled = false
    button3.disabled = false
    button4.disabled = false

    drawRectangleProgress()

  }
  else if ((start==numberOfIter)){
    button1.innerText = "- - -"
    button2.innerText = "- - -"
    button3.innerText = "- - -"
    button4.innerText = "- - -"
    showResults()
  }
}

/*-------------------------------------------------*/
function showResults(){
  // results.style.visibility = "visible";
  results.style.display = "block";
  results_chart.style.display = "block";
  //pics_div.style.display = "block";

  results.scrollIntoView();
  for (var i = 0; i < index_ary.length; i++) {
    if (index_ary[i]==1) {

      totalPositiveScore = totalPositiveScore + data[randomWordsIndex[i]]["positiveScore"]
      totalNegativeScore = totalNegativeScore + data[randomWordsIndex[i]]["negativeScore"]

      //console.log("PositiveScore", data[randomWordsIndex[i]]["Word"]);
      //console.log("PositiveScore", data[randomWordsIndex[i]]["positiveScore"]);
      //console.log("NegativeScore", data[randomWordsIndex[i]]["negativeScore"]);

      //console.log("totalPositiveScore",totalPositiveScore);
      //console.log("totalNegativeScore",totalNegativeScore);
    }
  }
  target = (totalPositiveScore - totalNegativeScore)/numberOfIter

  //console.log("target = ", target);
  /* std = 1 so 3*std for each score  to move values beyond 0
  target = (target) + (2 * 3*0.7) */

  target = ((Math.tanh(target))+1)/2
  //if (target<0) {target=0}
  //if (target>10) {target=10}

  chartElem.dataset.value = target*100
  //console.log("target tanh= ", target);
  //console.log("value=",chartElem.dataset.value);
  var containers = document.getElementsByClassName("chart");
  var dial = new Dial(containers[0]);
  dial.animateStart();
}

/*-------------------------------------------------*/
function start_words(e){
  e.preventDefault();
  //showResults()
if (start===0) {
  assign_words()
  start++
  }
  else {
    alert("Already started... Please Select Word");
  }
}

/*-------------------------------------------------*/
function playAgain() {
  location.reload()
}

/*-------------------------------------------------*/
function runSelectWord_1(e){
  e.preventDefault();
  //console.log(start);
  index_temp = 0
  index_ary[index_temp + ((start-1) * 4)] = 1
  assign_words()
  start++
}

function runSelectWord_2(e){
  e.preventDefault();

  index_temp = 1
  index_ary[index_temp + ((start-1) * 4)] = 1
  assign_words()

  start++
}
function runSelectWord_3(e){
  e.preventDefault();

  index_temp = 2
  index_ary[index_temp + ((start-1) * 4)] = 1
  assign_words()

  start++
}
function runSelectWord_4(e){
  e.preventDefault();

  index_temp = 3
  index_ary[index_temp + ((start-1) * 4)] = 1
  assign_words()

  start++
}
/*-------------------------------------------------*/
