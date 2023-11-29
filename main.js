// *** Global Variables ***
//Title screen
const titleScreen = document.querySelector("#titleSection");
const playButton = document.querySelector("#playBtn");
const hiscoresButton = document.querySelector("#hiscoresBtn");
const settingsButton = document.querySelector("#settingsBtn");
//Game screen
const gameScreenNextPieceSection = document.querySelector("#nextPieceSection");
const gameScreenCenter = document.querySelector("#mainCenterSection");
const gameScreenScoreSection = document.querySelector("#scoreSection");
const gameScreenInstSection = document.querySelector("#instructionsSection");
const gameScreenOptionsSection = document.querySelector("#optionsSection");
const nextPieceArea = document.querySelector("#nextPieceArea");
const playArea = document.querySelector("#playArea");
const scoreLabel = document.querySelector("#scoreLabel");
const nameSubmitButton = document.querySelector("#nameSubmitBtn");
//Overlay
const gameDiffScreen = document.querySelector("#gameDifficulty");
const gameOverScreen = document.querySelector("#gameOver");
//Game runtime variables
let currentTetromino;
let nextTetromino;
let currentTetrominoShapeArray;
let currentMovementInput;
let currentScore;
let gameSpeed; //set by difficulty
let startTimeStamp; //start of game loop, use this as the timer
let previousTimeStamp; //end of last iteration of the game loop
let totalElapsedTime; //stores total time to be evaluated against speed set by game difficulty
let isGameOver;
let isResetGame;
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

function getRandomShape(){
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
  hideElement(playButton.classList);
  hideElement(hiscoresButton.classList);
  hideElement(settingsButton.classList);
  hideElement(gameScreenNextPieceSection.classList);
  hideElement(gameScreenCenter.classList);
  hideElement(gameScreenScoreSection.classList);
  hideElement(gameScreenInstSection.classList);
  hideElement(gameScreenOptionsSection.classList);
  hideElement(gameDiffScreen.classList);
  hideElement(gameOverScreen.classList);
}

function renderTitleScreen(){
  resetRender();
  loadElement(titleScreen.classList);
  loadElement(playButton.classList);
  loadElement(hiscoresButton.classList);
  loadElement(settingsButton.classList);
}

function renderGameScreen(){
  resetRender();
  loadElement(gameScreenNextPieceSection.classList);
  loadElement(gameScreenCenter.classList);
  loadElement(gameScreenScoreSection.classList);
  loadElement(gameScreenInstSection.classList);
  loadElement(gameScreenOptionsSection.classList);
  resetGame();
}

//Button events
function initButtons(){
  playButton.addEventListener("click", (event) => {
    event.preventDefault();    
    loadElement(gameDiffScreen.classList);
  });
  const endGameButton = document.querySelector("#exitGameBtn");
  endGameButton.addEventListener("click", (event) => {
    event.preventDefault();
    resetRender();
    renderTitleScreen();
    resetGame();
  });
  const startButton = document.querySelector("#startGameBtn");
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    startGame();
  });
  const resetGameButton = document.querySelector("#resetGameBtn");
  resetGameButton.addEventListener("click", (event) => {
    event.preventDefault();
    isResetGame = true; //flag, to be fired in game loop
  })
  let difficultyButtons = [];
  difficultyButtons.push(document.querySelector("#easyDiffBtn"));
  difficultyButtons.push(document.querySelector("#normalDiffBtn"));
  difficultyButtons.push(document.querySelector("#hardDiffBtn"));
  difficultyButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      switch(button.innerHTML.toUpperCase()){
        case "EASY":
          gameSpeed = 1500;
          break;
        case "HARD":
          gameSpeed = 500;
          break;
        default:
          gameSpeed = 1000;
          break;
      }
      setTimeout(() => { //to delay abit while web elements are generating
        resetRender();
        renderGameScreen();
      }, 500);
    });
  });
  nameSubmitButton.addEventListener("click", (event) => {
    const name = document.querySelector("nameInput");
    localStorage.setItem("gahiscore3", name);
  });
  const closeGameOverButton = document.querySelector("#closeGameOverBtn");
  closeGameOverButton.addEventListener("click", (event) => {
    event.preventDefault();
    hideElement(gameOverScreen.classList);
    resetGame();
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
        break;
      case "r":
        currentMovementInput = "ROTATE";
        break;
      default:
        break;
    }
  });
}

//Function to start game loop
function startGame(){
  //https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
  startTimeStamp = Date.now();
  previousTimeStamp = startTimeStamp;
  totalElapsedTime = 0;
  currentMovementInput = "";
  window.requestAnimationFrame(gameLoop); 
}

//Function to reset and init game variables
function resetGame(){
  currentTetromino = null;
  nextTetromino = null;
  currentTetrominoShapeArray = [];
  currentScore = 0;
  scoreLabel.innerHTML = currentScore;
  currentMovementInput = "";
  startTimeStamp = 0; 
  previousTimeStamp = 0; 
  totalElapsedTime = 0;
  isGameOver = false;
  isResetGame = false;
  //Create play area by creating an img element per grid square
  //Width = 10 cells, height = 20 cells (x1y1, x2y1), 2 cells hidden buffer above play area to generate and drop tetromino
  playArea.replaceChildren(); //Chrome/Edge 86+, Firefox 78+, and Safari 14+, otherwise use innerHTML = "";
  nextPieceArea.replaceChildren();
  for (let y = 0; y < 22; y++){
    for (let x = 0; x < 10; x++){
      const cell = document.createElement("img");
      cell.setAttribute("src", whiteColour);
      cell.setAttribute("width", "100%");
      cell.setAttribute("height", "100%");
      cell.setAttribute("border", "1px solid");
      cell.setAttribute("id", "x"+ x +"y" + y);
      if (y < 1){
        cell.classList.add("hide");
      }
      playArea.append(cell);
    }
  }
  clearAllAnimationFrames();
}

function gameLoop(){
  let currentTimeStamp = Date.now();
  totalElapsedTime += (currentTimeStamp - previousTimeStamp);
  if (isResetGame){ //reset can be called at any point
    setTimeout(() => {
      clearAllAnimationFrames();
    }, 200);
    resetGame();
    return;
  }
  if (currentTetromino === null || currentTetromino.hasEnded){
    clearLine(); //once piece has landed, check if any lines are solved
    checkGameOver(); //check game over after latest piece has landed
    if (isGameOver){
      setTimeout(() => {
        clearAllAnimationFrames();
      }, 200);
      loadElement(gameOverScreen.classList);
      return;
    }
    if (nextTetromino === null){ //init loop
      nextTetromino = createTetromino();
    }
    currentTetromino = nextTetromino;
    colourCells(currentTetromino.coordsArray, currentTetromino.colour);
    nextTetromino = createTetromino();
    drawNextTetromino();
    totalElapsedTime = 0;
  }
  if (currentTetromino.isLocked){
    moveTetromino("FALL");
    totalElapsedTime = 0;
  } else {
    if (totalElapsedTime >= gameSpeed) {
      //Default falling logic, based on game speed and used to determine if new piece is needed
      let yCoordBefore = parseInt(currentTetromino.coords.substring(3));
      if (yCoordBefore <= 20){ //y21 is lowest point in play area
        moveTetromino("FALL");
      } 
      totalElapsedTime = 0;
    } else {
      if (currentMovementInput !== ""){
        //Allow movement on the other ticks that the default falling logic is not on
        moveTetromino(currentMovementInput);
        currentMovementInput = "";
      }
    }
  }
  previousTimeStamp = currentTimeStamp;
  window.requestAnimationFrame(gameLoop);
}

function checkGameOver(){
  //Check 2nd topmost row for any obstructions before creation, otherwise game over
  for (let x = 0; x < 10; x++){
    const topCell = document.querySelector("#x" + x + "y1");
    if (topCell.getAttribute("src") !== whiteColour){
      isGameOver = true;
      return;
    }
  }
}

function createTetromino(){
  const newTetromino = new Tetromino("x4y1", getRandomShape());
  newTetromino.coordsArray = generateShape(newTetromino.coords, newTetromino.shape, newTetromino.shapeRotation); 
  return newTetromino;
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

//Colour array of cells with param
function colourCells(coordsArray, colour){
  for (const coords of coordsArray){
    const cell = document.querySelector("#" + coords);
    cell.setAttribute("src", colour);
  }
}

//General function to manipulate tetermino movement, rotations
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
  const unusedCoordsArray = currentTetromino.coordsArray.filter((currentCoords) => !nextCoordsArray.includes(currentCoords));
  let isFilled = false;
  for (const newCoords of newCoordsArray){
    const newCell = document.querySelector("#" + newCoords);
    if (newCell === null){
      if (direction === "ROTATE"){//reset to previous rotation position
        if (currentTetromino.shapeRotation > 0){
          currentTetromino.shapeRotation -= 1;
        } else{
          switch (currentTetromino.shape){
            case "I":
              currentTetromino.shapeRotation = 1;
              break;
            case "O":
              currentTetromino.shapeRotation = 0;
              break;
            default:
              currentTetromino.shapeRotation = 3;
              break;  
          }
        }
      }
      return; //stop any action that involves unknown cells (out of play area);
    }
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

//Check if line is formed and to clear it, cycle through each row to check if all are coloured
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
  const completedLines = completedRows.length;
  //Check for completed lines
  if (completedLines > 0){
    //remove entire row of cells, to be replaced with new rows of cells
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
    //Cycle through playarea and reassign id again since there is a shift in rows
    let yIndex = 0;
    let xIndex = 0;
    const allCells = playArea.children;
    for (const cell of allCells){
      if (xIndex === 10){
        xIndex = 0;
        yIndex += 1;
      }
      cell.setAttribute("id", "x"+ xIndex +"y" + yIndex);
      if (yIndex < 1){
        cell.classList.add("hide");
      } else{
        cell.classList.remove("hide");
        cell.classList.add("show");
      }
      xIndex += 1;
    }
    //Count and add to highscores
    let scoreMultiplier = 1;
    let incomingScore = 0;
    for (let i = 0; i < completedLines; i++){
      incomingScore += (100 * scoreMultiplier);
      scoreMultiplier += 1;
    }
    currentScore += incomingScore;
    scoreLabel.innerHTML = currentScore;
  }   
}

//Function to separately draw the next piece in its own area
function drawNextTetromino(){
  nextPieceArea.replaceChildren();
  for (let y = 0; y < 2; y++){
    for (let x = 0; x < 5; x++){
      const cell = document.createElement("img");
      cell.setAttribute("src", whiteColour);
      cell.setAttribute("width", "100%");
      cell.setAttribute("height", "100%");
      cell.setAttribute("grid-column", x + 1);
      cell.setAttribute("grid-row", y + 1);
      cell.setAttribute("border", "1px solid");
      cell.setAttribute("id", "npx"+ x +"y" + y);
      nextPieceArea.append(cell);
    }
  }
  const array = generateShape("x2y1", nextTetromino.shape, nextTetromino.rotation);
  const nextPieceAreaArray = array.map((coord) => "np" + coord);
  colourCells(nextPieceAreaArray, nextTetromino.colour);
}

function clearAllAnimationFrames(){
  //https://stackoverflow.com/questions/52285581/cancel-all-currently-running-requestanimationframes
  let rafId = window.requestAnimationFrame(() => {}); //call empty function to get latest id
  while(rafId--){
    window.cancelAnimationFrame(rafId);
  }
}

function main(){
  initButtons();
  initKeyboardEvents();
  renderTitleScreen();
}

main();