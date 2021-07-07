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
