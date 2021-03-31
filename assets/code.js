const colorVariants = ['green', 'red', 'blue', 'yellow', 'orange', 'brown'];


/* Add Color Style */
let colorStyles = '<style>';
for (let i = 0; i < colorVariants.length; i += 1) {
  colorStyles += `.bg-${colorVariants[i]} { background-color: ${colorVariants[i]}; } `
};
colorStyles += '</style>';
document.querySelector('body').innerHTML += colorStyles;


/* Draw Playground */
function drawPlayground(fieldsContent) {
  let gameFields = '';
  for (let h = 0; h < 4; h += 1) {
    gameFields += `<div class="game-field game-field-header">${h+1}</div>`;
  }
  gameFields += `<div class="game-field game-field-header">B + W</div>`;
  for (let i = 0; i < 50; i += 1) {
    gameFields += `<div class="game-field bg-${fieldsContent[i]}">${fieldsContent[i]}</div>`
  }
  document.querySelector('.playground').innerHTML = gameFields;
};

/* Reset Playground */
function resetPlayground() {
  let fieldsContent = [];
  for (let i = 0; i < 50; i += 1) { fieldsContent[i] = '-' };
  for (let i = 4; i < 50; i += 5) { fieldsContent[i] = '?' };
  drawPlayground(fieldsContent);
  return fieldsContent;
};


/* Draw Guess Board */
function drawGuessBoard() {
  let codebreakerInputFields = '';
  for (let j = 0; j < 4; j += 1) {
    codebreakerInputFields +=
      `<div class="codebreaker-input-column codebreaker-input-${j}-color">
        <div class="text-align-center font-bold">${j+1}
      </div>`;
    for (let i = 0; i < colorVariants.length; i += 1) {
      codebreakerInputFields +=
        `<div class="color-radio bg-${colorVariants[i]}">
           <input type="radio" id="column-${j}-${colorVariants[i]}"
             name="column-${j}" value="${i}">

        </div>`;
    }
    codebreakerInputFields += '</div>';
  };
  document.querySelector('.guess-board').innerHTML =
    `<form name="guess-form" class="codebreaker-form">
      ${codebreakerInputFields} 
      <button type="submit" id="submit-guess" class="codebreaker-guess-button">Guess</button>
    </form>`;
};


/* Get Mastermind Secret Code */
// one random colorID
function generateRandomColorID() {
  return Math.floor(Math.random() * colorVariants.length);
};
// Mastermind Secret Code: four colorIDs
function getMastermindSecretCode() {
  let secretCode = [];
  for (let j = 0; j < 4; j += 1) {
    secretCode[j] = generateRandomColorID();
  }
  return secretCode;
};


/* Compare Mastermind Secret Code and Codebreaker Guess */
// correct color at the correct position
function countCorrectPosition(secretCode, currentGuess) {
  let correctPositionCount = 0;
  for (let j = 0; j < 4; j += 1) {
    if (secretCode[j] === currentGuess[j]) {
      correctPositionCount += 1;
    }
  }
  return correctPositionCount;
};
// correct color
function countCorrectColor(secretCode, currentGuess) {
  let compareCurrentGuess = [...currentGuess];
  let correctColorCount = 0;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if (secretCode[i] === compareCurrentGuess[j]) {
        correctColorCount += 1;
        compareCurrentGuess[j] = -1;
        break;
      }
    }
  }
  return correctColorCount;
};
// compare
function compareSecretCodeCurrentGuess(secretCode, currentGuess) {
  let correctPosition = countCorrectPosition(secretCode, currentGuess);
  let correctColor = countCorrectColor(secretCode, currentGuess);
  console.log('Correct color: ', correctColor);
  console.log('Correct position: ', correctPosition);
  return [correctPosition, correctColor];
};


/* Draw Playground with Guess */
function drawPlaygroundWithGuess(currentGuess, guessNumber, fieldsContent, correctPosition, correctColor) {
  // draw guessed colors
  for (let j = 0; j < 5; j += 1) {
    if ( j == 4 ) {
      fieldsContent[(j + 45 - (guessNumber-1)*5)] = correctPosition + ' + ' + (correctColor - correctPosition);
    } else {
      fieldsContent[(j + 45 - (guessNumber-1)*5)] = colorVariants[currentGuess[j]];
    }
  }
  drawPlayground(fieldsContent);
}


/* Win or Reached Max Guess Number: Game Over */
function isGameOver(correctPosition, guessNumber){
  let gameOver = false;
  if ( correctPosition == 4 && guessNumber <= 10 ) {
    gameOver = true;
    document.querySelector('.result-message').innerHTML = 'You Win!';
  } else if ( correctPosition != 4 && guessNumber >= 10 ) {
    gameOver = true;
    document.querySelector('.result-message').innerHTML = 'You Lose!';
  };
  if ( gameOver ) {
    document.querySelector('.new-game-button').addEventListener('click', function() {
      document.querySelector('.result-wrapper').style.display = 'none';
      letsPlay();
    });
    document.querySelector('.result-wrapper').style.display = 'block';
  };
  return gameOver;
};


/* Listen to Codebreaker */
function codebreakerPlays(secretCode, guessNumber, fieldsContent) {
  /* Listening submit click event */
  const submit_button = document.getElementById('submit-guess');
  submit_button.addEventListener('click', function(e) {
    // disable default submit
    e.preventDefault();
    // collecting guessed colorIDs in currentGuess
    const currentGuess = [];
    for (let j = 0; j < 4; j += 1) {
      let radioButtons = document.getElementsByName(('column-' + j));
      for (let i = 0; i < radioButtons.length; i += 1) {
        currentGuess[j] = '0';
        if (radioButtons[i].checked) {
          // putting guessed color id number into currentGuess array
          currentGuess[j] = parseInt(radioButtons[i].value);
          // only one radio button can be checked
          break;
        }
      }
    }
    guessNumber += 1;
    console.log('%c' + guessNumber + '. guess', "color: orange; font-weight: bold");
    console.log('Mastermind: ' + secretCode);
    console.log('Codebreaker: ' + currentGuess);
    let compareResults = compareSecretCodeCurrentGuess(secretCode, currentGuess);
    drawPlaygroundWithGuess(currentGuess, guessNumber, fieldsContent, compareResults[0], compareResults[1]);
    isGameOver(compareResults[0], guessNumber)
  });
};


/* Play */
function letsPlay() {
  console.clear();
  let guessNumber = 0;
  let fieldsContent = resetPlayground();
  drawGuessBoard();
  const secretCode = getMastermindSecretCode();
  codebreakerPlays(secretCode, guessNumber, fieldsContent);
};
letsPlay();
