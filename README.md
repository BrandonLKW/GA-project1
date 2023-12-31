# GA-project1

**_ Tetris _**

This is my implementation of the Tetris game.
Game is done in a DOM structure as per project requirements, consisting of a single HTML, CSS, and JS file.
Any additional features or references to solutions will be credited/commented beside the implementation as needed.

The set rules of the implemenation so far are as follows:
Play area:

- width = 10 cells, height = 21 cells
- 1 row hidden buffer above play area
- Tetromino (pieces) must appear on row 21 and 22 of play area, starting with their flat side down
- Game over screen when highest point in game area reached (piece stacked on row 21 and above)

Tetrominios (game pieces):

- 7 types of Tetrominos (See https://tetris.wiki/Tetromino)
- Generated in a pseudo-random pattern, where all shapes must be created at least once before the next 7 shapes are added again
- Super Rotation System (SRS) (See https://tetris.wiki/Super_Rotation_System)

Scoring:

- Basic score of 100 when a row is completed and cleared
- Score to scale more based on increasing rows cleared (1 row -> 100, 2 rows -> 300, etc)

**_ Screenshots _**
Main landing screen:
https://imgur.com/a/Yeqf4wI
Highscore screen:
https://imgur.com/a/MCIxIrJ
Difficulty selection screen:
https://imgur.com/a/xLw3hF4
Play screen:
https://imgur.com/a/eLzO0hA
Game Over screen:
https://imgur.com/a/33qXHzU

**_ Getting started _**
It should be straightforward to pull the files as needed to run in your local server.
Otherwise, you can try this temporary link https://ga-project1-vert.vercel.app/.

In the main title screen, you can hit play to be prompted a difficulty selection screen.
The selected difficulty will determine the default falling speed of the Tetrominos
Easy -> 1.5 seconds
Normal -> 1 second
Hard -> 0.5 seconds

On selection of the difficulty, you will be navigated to the play screen where you can choose to start at your own pace.
Choosing to start will immediately begin the game loop and create the pieces, dropping them at intervals as determined by the difficulty.
You can proceed to move the pieces to try and complete a row via your keyboard inputs.
The following keys are mapping to certain actions:
'->' key moves the current Tetromino piece right
'<-' key moves the current Tetromino piece left
Space key performs the hard drop feature, where the current Tetromino piece is locked and falls all the way down from its current position
'R' key rotates the current Tetromino piece

As the game progresses, if there is a piece that falls in the 21st row, then it is considered a Game Over and the game loop will end.
The Game Over screen will be shown, and if the current game score is higher than any of the existing 5 scores, there will be a prompt to enter your name to save this.
Alternatively you can also just choose to cancel to skip this.
For either options, the game and play area will be reset and you can hit start to begin the game loop again with the previously chosen difficulty.

**_ Next Steps _**
These are the current items that were in the pipeline to be added or are future improvements to this game.
Reasons for not implementing them are mostly due to the lack of time, or are outside of the required scope of the project and are deemed as quality of life improvements.
This list will be addressed and updated depending on future plans.

- Adding a 'Kick back' function for the Tetrominos, so that the gameplay is smoother when trying to rotate the piece when it is touching either of the walls
- Adding a hold function for the Tetrominos to allow users to save a piece for a future drop
- Adding sound/music effects for actions (like row clearing/ Tetromino falling)
- Adding a settings menu for accessbility options (e.g colour blindness option, night/day mode toggle)
- Adding a more user friendly styling/theme
