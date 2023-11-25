//Global params
const titleScreen = document.querySelector("#titleSection");
const titleSubScreenHeader = document.querySelector("#titleHeaderSubSection");
const titleSubScreenMenu = document.querySelector("#titleMenuSubSection");
const gameScreen = document.querySelector("#mainGame");
const gameSubScreenLeft = document.querySelector("#mainLeftSection");
const gameSubScreenCenter = document.querySelector("#mainCenterSection");
const gameSubScreenRight = document.querySelector("#mainRightSection");
const startGameButton = document.querySelector("#startGameBtn");
const endGameButton = document.querySelector("#exitGameBtn");


//Render methods
function loadElement(elementClasses){
  elementClasses.remove("hide");
  elementClasses.add("show");
}

function hideElement(elementClasses){
  elementClasses.remove("show");
  elementClasses.add("hide");
}

function resetRender(){
  hideElement(titleScreen.classList);
  hideElement(titleSubScreenHeader.classList);
  hideElement(titleSubScreenMenu.classList);
  hideElement(gameScreen.classList);
  hideElement(gameSubScreenLeft.classList);
  hideElement(gameSubScreenCenter.classList);
  hideElement(gameSubScreenRight.classList);
}

function renderTitleScreen(){
  resetRender();
  loadElement(titleSection.classList);
  loadElement(titleHeaderSubSection.classList);
  loadElement(titleMenuSubSection.classList);
}

function renderGameScreen(){
  resetRender();
  loadElement(gameScreen.classList);
  loadElement(mainLeftSection.classList);
  loadElement(mainCenterSection.classList);
  loadElement(mainRightSection.classList);
}

//Button events
function initButtons(){
  startGameButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetRender();
    renderGameScreen();
  });
  endGameButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetRender();
    renderTitleScreen();
    // titleScreen.style.display = "block";
    // gameScreen.style.display = "none";
  });
}

//Keyboard events
//event = "keydown"


//Fire all logic
function main(){
  initButtons();
  renderTitleScreen();
  console.log(titleScreen.classList);
  console.log(gameScreen.classList);
}

main();