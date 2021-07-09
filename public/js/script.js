document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("recipes-iron JS imported successfully!");
  },
  false
);

function changeRatingClass() {
  document.querySelector("#star").style.fontWeight = 900;
} 
function changeRatingClass2() {
  document.querySelector("#star").style.fontWeight = 400;
}

function changeFavClass(){
  document.querySelector("#heart").style.fontWeight = 900;
}

 function changeFavClass2() {
  document.querySelector("#heart").style.fontWeight = 400;
}

function displayClickedMessageFav() {
  const button = document.getElementById("fav-on-click").style.display = "block";
}
function displayClickedMessageRat() {
  const button = document.getElementById("rat-on-click").style.display = "block";
}