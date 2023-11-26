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

let currentTetromino = null;
let currentMovementInput = "";
const gameSpeed = 1500; //set by difficulty

class Tetromino{
  constructor(coords, shape){
    this.coords = coords; //element id
    this.shape = shape;
    this.coordsArray = [];
    this.isLocked = false;
  }

  rotate(){
    //WIP
  }
}


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
        currentMovementInput = "LEFT";
        break;
      case "ArrowRight":
        currentMovementInput = "RIGHT";
        break;
      case " ":
        currentMovementInput = "HARD_FALL";
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
  currentTetromino = new Tetromino("x4y0", "one-block");
  currentTetromino.coordsArray = generateShape(currentTetromino.coords, "test"); 
  colourCells(currentTetromino.coordsArray, "red-box.png");

  //https://stackoverflow.com/questions/37949099/how-to-combine-a-do-while-loop-and-setinterval-timer-function
  let intervalCount = 0;
  intervalId = setInterval(() => {
    if (intervalCount === gameSpeed){
      if (currentTetromino.coords !== "x4y19"){
        moveTetromino("FALL");
      } else{
        clearInterval(intervalId);
      }
      intervalCount = 0;
    } else{
      if (currentMovementInput !== ""){
        moveTetromino(currentMovementInput);
        currentMovementInput = "";
      }
      intervalCount += 100;
    }
  }, 100); //use 0.1sec tick to detect user input for now
}

//Create array of x-y coords based on main coords and shape
function generateShape(coords, shape){
  const mainCell = document.querySelector(coords); //#x4y0
  const cellArray = [];
  //Based on shape, generate adjacent cells
  switch (shape){
    default:
      cellArray.push(coords);
      break;  
  }
  return cellArray;
}

function colourCells(coordsArray, colour){
  for (const coords of coordsArray){
    const cell = document.querySelector("#" + coords);
    cell.setAttribute("src", colour);
  }
}

function moveTetromino(direction){ //compare vertically, e.g. prev = y2, next = y3
  //Determine x-y coords based on direction
  const mainCell = document.querySelector("#" + currentTetromino.coords);
  let xCoord = parseInt(mainCell.getAttribute("id").substring(2,1));
  let yCoord = parseInt(mainCell.getAttribute("id").substring(3));
  switch(direction){
    case "LEFT":
      xCoord -= 1;
      break;
    case "RIGHT":
      xCoord += 1;
      break;
    case "HARD_FALL":
      mainCell.isLocked = true;
      break;
    case "FALL":
      yCoord += 1;
      break;
    default:
      break;
  }
  //Check if new position is available for shape
  const nextCoords = "x" + xCoord + "y" + yCoord;
  const nextCoordsArray = generateShape(nextCoords, "test"); 
  //Exclude common cells (comparing prev and next), then check if these new cells are already filled
  const newCoordsArray = nextCoordsArray.filter((nextCoords) => !currentTetromino.coordsArray.includes(nextCoords));
  const unusedCoordsArray = currentTetromino.coordsArray.filter((nextCoords) => !nextCoordsArray.includes(nextCoords));
  let isFilled = false;
  for (const newCoords of newCoordsArray){
    const newCell = document.querySelector("#" + newCoords);
    if (newCell.getAttribute("src") === "red-box.png"){
      isFilled = true;
    }
  }
  if (!isFilled){
    //If movement is allowed, colour new cells with shape colour
    currentTetromino.coords = nextCoords;
    currentTetromino.coordsArray = nextCoordsArray;
    colourCells(newCoordsArray, "red-box.png");
    colourCells(unusedCoordsArray, "white-box.png"); //Colour unused cells white again
  } else{
    //If floor is reached, then end function
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