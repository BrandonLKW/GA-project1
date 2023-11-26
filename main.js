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
const clearLnButton = document.querySelector("#clearLnBtn");

let currentTetromino = null;
let currentTetrominoShapeArray = [];
let currentMovementInput = "";
const gameSpeed = 1000; //set by difficulty

//Images
const whiteColour = "\\images\\white-box.png";
const redColour = "\\images\\red-box.png";
const blueColour = "\\images\\blue-box.png";
const greenColour = "\\images\\green-box.png";
const yellowColour = "\\images\\yellow-box.png";
const purpleColour = "\\images\\purple-box.png";
const tealColour = "\\images\\teal-box.png";
const orangeColour = "\\images\\orange-box.png";

class Tetromino{
  constructor(coords, shape){
    this.coords = coords; //element id
    this.shape = shape;
    this.colour = "";
    this.shapeRotation = 0;
    this.coordsArray = [];
    this.isLocked = false;
    this.hasEnded = false;

    this.setColour();
  }

  setColour(){
    switch (this.shape){
      case "I":
        this.colour = tealColour;
        break;
      case "J":
        this.colour = blueColour;
        break;
      case "L":
        this.colour = orangeColour;
        break;
      case "O":
        this.colour = yellowColour;
        break;
      case "S":
        this.colour = greenColour;
        break;
      case "Z":
        this.colour = redColour
        break;
      case "T":
        this.colour = purpleColour
        break;
      default:
        break;
    }
  }
}

function pullRandomTetromino(){
  //Cycles through all shapes once before resetting again
  if (currentTetrominoShapeArray.length === 0){
    currentTetrominoShapeArray = ["I", "J", "L", "O", "S", "Z", "T"];
  }
  //https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  const randomIndex = Math.floor(Math.random() * currentTetrominoShapeArray.length);
  const randomValue = currentTetrominoShapeArray[randomIndex];
  currentTetrominoShapeArray.splice(randomIndex, 1);
  return randomValue;
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
    resetGame();
  });
  testButton.addEventListener("click", (event) => {
    startGame();
  });
  clearLnButton.addEventListener("click", (event) => {
    clearLine();
  })
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
        break;
      case "r":
        currentMovementInput = "ROTATE";
        break;
      default:
        break;
    }
  });
}

//build play area
//width = 10 cells, height = 20 cells (x1y1, x2y1)
//2 cells hidden buffer above play area, to generate and drop tetromino
function createPlayArea(){ 
  //new array
  for (let y = 0; y < 22; y++){
    for (let x = 0; x < 10; x++){
      //Create html element
      const cell = document.createElement("img");
      cell.setAttribute("src", whiteColour);
      cell.setAttribute("width", "100%");
      cell.setAttribute("height", "100%");
      cell.setAttribute("border", "1px solid");
      cell.setAttribute("id", "x"+ x +"y" + y);
      playArea.append(cell);
    }
  }
}

//function to create tetrominos in the middle of the first line of play area (x4y0, x5y0)
//https://stackoverflow.com/questions/37949099/how-to-combine-a-do-while-loop-and-setinterval-timer-function
function startGame(){
  let gameOver = false;
  let intervalCount = 0; //for syncing with determined game speed
  intervalId = setInterval(() => {
    if (gameOver){
      clearInterval(intervalId);
    }
    if (currentTetromino === null || currentTetromino.hasEnded){
      clearLine(); //once piece has landed, check if any lines are solved
      //Check 2nd topmost row for any obstructions before creation, otherwise game over
      for (let x = 0; x < 10; x++){
        const topCell = document.querySelector("#x" + x + "y1");
        if (topCell.getAttribute("src") !== whiteColour){
          gameOver = true;
          return;
        }
      }
      //Create new piece as needed
      currentTetromino = new Tetromino("x4y1", pullRandomTetromino());
      currentTetromino.coordsArray = generateShape(currentTetromino.coords, currentTetromino.shape, currentTetromino.shapeRotation); 
      colourCells(currentTetromino.coordsArray, currentTetromino.colour);
      intervalCount = 0; //reset timer
    }
    if (currentTetromino.isLocked){
      //If hard drop, no interation allowed
      moveTetromino("FALL");
      intervalCount = 0;
    } else{
      //Otherwise proceed game logic as usual
      if (intervalCount >= gameSpeed){
        //Default falling logic, based on game speed and used to determine if new piece is needed
        let yCoordBefore = parseInt(currentTetromino.coords.substring(3));
        if (yCoordBefore <= 20){ //y21 is lowest point in play area
          moveTetromino("FALL");
        } 
        intervalCount = 0;
      } else{
        //Allow movement on the other ticks that the default falling logic is not on
        if (currentMovementInput !== ""){
          moveTetromino(currentMovementInput);
        }
      }
    }
    intervalCount += 100;
    currentMovementInput = "";
    console.log(intervalCount);
  }, 100); //use 0.1sec tick to detect user input for now
  //resetGame();
}

function resetGame(){
  playArea.innerHTML = "";
}

//Create array of x-y coords based on main coords and shape
function generateShape(coords, shape, rotation){
  let xCoords = parseInt(coords.substring(2, 1));
  let yCoords = parseInt(coords.substring(3));
  const cellArray = [];
  cellArray.push(coords);
  //{} -> denotes mainCell, [] -> denotes adj cells
  switch (shape){
    case "I":
      if (rotation === 1){
        //position 1
        // ([])("")("")("")
        // ([])("")("")("")
        // ({})("")("")("")
        // ([])("")("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 2));
      } else{
        //position 0
        // ("")("")("")("")
        // ([])({})([])([])
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 2) + "y" + yCoords);
      }
      break;
    case "J":
      if (rotation === 1){
        //position 1
        // ([])([])("")("")
        // ({})("")("")("")
        // ([])("")("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords - 1));
      } else if (rotation === 2){
        //position 2
        // ("")("")("")("")
        // ([])({})([])("")
        // ("")("")([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords + 1));
      } else if (rotation === 3){
        //position 3
        // ("")([])("")("")
        // ("")({})("")("")
        // ([])([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords + 1));
      } else{
        //position 0
        // ([])("")("")("")
        // ([])({})([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords - 1));
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
      }
      break;
    case "L":
      if (rotation === 1){
        //position 1
        // ([])("")("")("")
        // ({})("")("")("")
        // ([])([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords + 1));
      } else if (rotation === 2){
        //position 2
        // ("")("")("")("")
        // ([])({})([])("")
        // ([])("")("")("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords + 1));
      } else if (rotation === 3){
        //position 3
        // ([])([])("")("")
        // ("")({})("")("")
        // ("")([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords - 1));
      } else{
        //position 0
        // ("")("")([])("")
        // ([])({})([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords - 1));
      }
      break;
    case "O":
      //position 0
      // ([])([])("")("")
      // ([])({})("")("") //no rotation needed
      cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
      cellArray.push("x" + (xCoords - 1) + "y" + (yCoords - 1));
      cellArray.push("x" + xCoords + "y" + (yCoords - 1));
      break;
    case "S":
      if (rotation === 1){
        //position 1
        // ("")([])("")("")
        // ("")({})([])("")
        // ("")("")([])("")
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords + 1));
      } else if (rotation === 2){
        //position 2
        // ("")("")("")("")
        // ("")({})([])("")
        // ([])([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
      } else if (rotation === 3){
        //position 3
        // ([])("")("")("")
        // ([])({})("")("")
        // ("")([])("")("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
      } else{
        //position 0
        // ("")([])([])("")
        // ([])({})("")("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords - 1));
      }
      break;
    case "Z":
      if (rotation === 1){
        //position 1
        // ("")("")([])("")
        // ("")({})([])("")
        // ("")([])("")("")
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords - 1));
      } else if (rotation === 2){
        //position 2
        // ("")("")("")("")
        // ([])({})("")("")
        // ("")([])([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords + 1) + "y" + (yCoords + 1));
      } else if (rotation === 3){
        //position 3
        // ("")([])("")("")
        // ([])({})("")("")
        // ([])("")("")("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords + 1));
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
      } else{
        //position 0
        // ([])([])("")("")
        // ("")({})([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords- 1));
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
      }
      break;
    case "T":
      if (rotation === 1){
        //position 1
        // ("")([])("")("")
        // ("")({})([])("")
        // ("")([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
      } else if (rotation === 2){
        //position 2
        // ("")("")("")("")
        // ([])({})([])("")
        // ("")([])("")("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
      } else if (rotation === 3){
        //position 3
        // ("")([])("")("")
        // ([])({})("")("")
        // ("")([])("")("")
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
        cellArray.push("x" + xCoords + "y" + (yCoords + 1));
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
      } else{
        //position 0
        // ("")([])("")("")
        // ([])({})([])("")
        cellArray.push("x" + (xCoords - 1) + "y" + yCoords);
        cellArray.push("x" + (xCoords + 1) + "y" + yCoords);
        cellArray.push("x" + xCoords + "y" + (yCoords - 1));
      }
      break;
    default:
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

function moveTetromino(direction){
  //Determine x-y coords based on direction
  const mainCell = document.querySelector("#" + currentTetromino.coords);
  let xCoord = parseInt(mainCell.getAttribute("id").substring(2,1));
  let yCoord = parseInt(mainCell.getAttribute("id").substring(3));
  switch(direction){
    case "LEFT":
      if (xCoord !== 0){
        xCoord -= 1;
      }
      break;
    case "RIGHT":
      if (xCoord !== 9){
        xCoord += 1;
      }
      break;
    case "HARD_FALL":
      currentTetromino.isLocked = true;
      break;
    case "FALL":
      if (yCoord !== 21){
        yCoord += 1;
      }
      break;
    case "ROTATE":
      currentTetromino.shapeRotation += 1; // +1 per rotate action
      switch (currentTetromino.shape){
        case "I":
          if (currentTetromino.shapeRotation > 1){
            currentTetromino.shapeRotation = 0;
          }
          break;
        case "O":
          currentTetromino.shapeRotation = 0;
          break;
        default:
          if (currentTetromino.shapeRotation > 3){
            currentTetromino.shapeRotation = 0;
          }
          break;  
      }
      break;
    default:
      break;
  }
  //Check if new position is available for shape
  const nextCoords = "x" + xCoord + "y" + yCoord;
  const nextCoordsArray = generateShape(nextCoords, currentTetromino.shape, currentTetromino.shapeRotation); 
  //Exclude common cells (comparing prev and next), then check if these new cells are already filled
  const newCoordsArray = nextCoordsArray.filter((nextCoords) => !currentTetromino.coordsArray.includes(nextCoords));
  const unusedCoordsArray = currentTetromino.coordsArray.filter((nextCoords) => !nextCoordsArray.includes(nextCoords));
  let isFilled = false;
  for (const newCoords of newCoordsArray){
    const newCell = document.querySelector("#" + newCoords);
    if (newCell.getAttribute("src") !== whiteColour){
      isFilled = true;
    }
  }
  if (!isFilled){
    //If movement is allowed, colour new cells with shape colour
    currentTetromino.coords = nextCoords;
    currentTetromino.coordsArray = nextCoordsArray;
    colourCells(newCoordsArray, currentTetromino.colour);
    colourCells(unusedCoordsArray, whiteColour); //Colour unused cells white again
  } 
  //check future y axis changes, if no changes means that floor is reached
  //check all lowest y-axis values from the coordsArray of the currentTetrominio object
  let lowestYCoord = 0;
  for (const newCoord of nextCoordsArray){
    const yCoord = parseInt(newCoord.substring(3));
    if (yCoord > lowestYCoord){
      lowestYCoord = yCoord;
    }
  }
  let futureYCoord = lowestYCoord + 1;
  if (futureYCoord <= 21){
    for (const newCoord of nextCoordsArray){
      if (newCoord.includes("y" + lowestYCoord)){
        const futureXCoord = parseInt(newCoord.substring(2,1));
        const futureCell = document.querySelector("#x" + futureXCoord + "y"  + futureYCoord);
        if (futureCell.getAttribute("src") !== whiteColour){
          currentTetromino.hasEnded = true;
        }
      }
    }
  } else{
    currentTetromino.hasEnded = true;
  }
}

//function to check if line is formed and to clear it
//Cycle through each row to check if all are coloured
function clearLine(){
  const completedRows = []; //store indices of completed lines
  for (let y = 0; y < 22; y++){
    let hasCompletedLine = true;
    const xAxisArray = [];
    for (let x = 0; x < 10; x++){
      const cellCoords = "#x" + x + "y" + y;
      const cell = document.querySelector(cellCoords);
      if (cell.getAttribute("src") === whiteColour){
        hasCompletedLine = false;
      }
      xAxisArray.push(cell);
    }
    if (hasCompletedLine){
      completedRows.push(xAxisArray);
    }
  }
  //remove entire row of cells
  //generate the missing rows of cells again
  //reassign id again
  const completedLines = completedRows.length;
  if (completedLines > 0){
    for (const xAxisArray of completedRows){
      for (const xAxis of xAxisArray){
        playArea.removeChild(xAxis);
      }
    }
    //add to the start of the list so that existing rows are pushed down, since id starts on top with x0y0
    for (let lines = 0; lines < completedLines; lines++){
      for (let i = 0; i < 10; i++){
        const cell = document.createElement("img");
        cell.setAttribute("src", whiteColour);
        cell.setAttribute("width", "100%"); 
        cell.setAttribute("height", "100%");
        cell.setAttribute("border", "1px solid");
        cell.setAttribute("id", "placeholder");
        playArea.prepend(cell);
      }
    }
    //Cycle through playarea and reassign id again
    let yIndex = 0;
    let xIndex = 0;
    const allCells = playArea.children;
    for (const cell of allCells){
      if (xIndex === 10){
        xIndex = 0;
        yIndex += 1;
      }
      cell.setAttribute("id", "x"+ xIndex +"y" + yIndex);
      xIndex += 1;
    }
  }   
}

//Fire all logic
function main(){
  initButtons();
  initKeyboardEvents();
  renderTitleScreen();
}

main();