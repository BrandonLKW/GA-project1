//Global params
const titleScreen = document.querySelector("#titleSection");
const startGameButton = document.querySelector("#startGameBtn");
const hiscoresButton = document.querySelector("#hiscoresBtn");
const settingsButton = document.querySelector("#settingsBtn");

const gameScreenLeft = document.querySelector("#mainLeftSection");
const gameScreenCenter = document.querySelector("#mainCenterSection");
const gameScreenRight = document.querySelector("#mainRightSection");
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
  hideElement(startGameButton.classList);
  hideElement(hiscoresButton.classList);
  hideElement(settingsButton.classList);

  hideElement(gameScreenLeft.classList);
  hideElement(gameScreenCenter.classList);
  hideElement(gameScreenRight.classList);
}

function renderTitleScreen(){
  resetRender();
  loadElement(titleScreen.classList);
  loadElement(startGameButton.classList);
  loadElement(hiscoresButton.classList);
  loadElement(settingsButton.classList);
}

function renderGameScreen(){
  resetRender();
  loadElement(gameScreenLeft.classList);
  loadElement(gameScreenCenter.classList);
  loadElement(gameScreenRight.classList);
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


// //* Add a new element to the DOM
// //* 1. create the new element
// const img = document.createElement("img");
// //* 2. maybe modify the element
// img.setAttribute("src", "https://picsum.photos/id/111/200/300");
// console.log(img); //? <img>
// //* 3. add the element to the DOM
// //* 3A , find the parent to add to
// const body = document.querySelector("p");
// //* 3B, actually do the add
// body.append(img);


//Fire all logic
function main(){
  initButtons();
  renderTitleScreen();
}

main();