// *** Global Variables ***
//Title screen
const titleScreen = document.querySelector("#titleSection");
const startGameButton = document.querySelector("#startGameBtn");
const hiscoresButton = document.querySelector("#hiscoresBtn");
const settingsButton = document.querySelector("#settingsBtn");
//Game screen
const gameScreenLeft = document.querySelector("#mainLeftSection");
const gameScreenCenter = document.querySelector("#mainCenterSection");
const gameScreenRight = document.querySelector("#mainRightSection");
const endGameButton = document.querySelector("#exitGameBtn");
const playArea = document.querySelector("#playArea");
const testButton = document.querySelector("#testShapeBtn");

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
  createPlayArea();
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
  });
  testButton.addEventListener("click", (event) => {
    createTetromino();
  });
}

//Keyboard events
function initKeyboardEvents(){
  document.addEventListener("keydown", (event) => {
    switch (event.key){
      case "ArrowLeft":
        console.log("LEFT ARROW PRESSED");
        break;
      case "ArrowRight":
        console.log("RIGHT ARROW PRESSED");
        break;
      case "ArrowDown":
        console.log("DOWN ARROW PRESSED");
        break;
      case " ":
        console.log("SPACE PRESSED")
      default:
        break;
    }
  });
}

//build play area
//width = 10 cells, height = 20 cells (x1y1, x2y1)
//20 cells hidden buffer above play area
let playAreaArray = [];
//loop through x-axis first
function createPlayArea(){ 
  //new array
  for (let y = 0; y < 20; y++){
    const playAreaXaxis = [];
    for (let x = 0; x < 10; x++){
      //Create data
      playAreaXaxis.push(0);

      //Create html element
      const cell = document.createElement("img");
      cell.setAttribute("src", "white-box.png");
      cell.setAttribute("width", "100%");
      cell.setAttribute("height", "100%");
      cell.setAttribute("border", "1px solid");
      cell.setAttribute("id", "x"+ x +"y" + y);
      //define width/height of playarea, then assign based on cell coords
      playArea.append(cell);
    }
    playAreaArray.push(playAreaXaxis);
  }
  console.log(playAreaArray);
}

//function to create tetrominos in the middle of the first line of play area (x4y0, x5y0)
function createTetromino(){
  const cell = document.querySelector("#x4y0");
  console.log(cell);
  //Check playarea to confirm not occupied
  if (cell.getAttribute("src") === "white-box.png"){
    cell.setAttribute("src", "red-box.png");
  } else{
    console.log("Game over");
  }
}


//function to check if line is formed and to clear it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
//a = Array(5).fill(0).map(x => Array(10).fill(0)) use fill to check landed pieces


//Fire all logic
function main(){
  initButtons();
  initKeyboardEvents();
  renderTitleScreen();
}

main();