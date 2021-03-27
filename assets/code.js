const colorVariants = ['green', 'red', 'blue', 'yellow', 'orange', 'brown'];


/* Draw Playground */
function drawPlayground(fieldsContent) {
  let gameFields = '';
  for (let h = 0; h < 4; h += 1) {
    gameFields += '<div class="game-field game-field-header">' + (h+1) + '</div>'
  }
  gameFields += '<div class="game-field game-field-header">Col/Pos</div>'
  for (let i = 0; i < 50; i += 1) {
    gameFields += '<div class="game-field">' + fieldsContent[i] + '</div>'
  }
  document.querySelector('.playground').innerHTML = gameFields
};

/* Draw Guess Board */
function drawGuessBoard() {
  let codebreakerInputFields = '';
  for (let j = 0; j < 4; j += 1) {
    codebreakerInputFields += '<div class="codebreaker-input-column codebreaker-input-' + j + '-color"><div class="text-align-center font-bold">' + (j+1) + '</div>';
    for (let i = 0; i < colorVariants.length; i += 1) {
      codebreakerInputFields +=
        '<div class="color-radio"><input type="radio" id="column-' + j + '-' + colorVariants[i] + '" name="column-' + j + '" value="' + i + '" required><label for="column-' + j + '-' + colorVariants[i] + '" class="column-radio-label color-' + colorVariants[i] + '">' + colorVariants[i] +'</label></div>';
    }
    codebreakerInputFields += '</div>';
  };
  document.querySelector('.guess-board').innerHTML = '<form name="guess-form" onsubmit="return showGuess();" class="codebreaker-form">' + codebreakerInputFields + 
    '<button type="submit" id="submit-guess" class="codebreaker-guess-button">Guess</button></form>';
};


/* Get Mastermind Secret Code */
// one random colorID
function generateRandomColorID() {
  return Math.floor(Math.random() * colorVariants.length);
};
// Mastermind Secret Code: four colorIDs
function mastermindSecretCode() {
  let secretCode = [];
  for (let j = 0; j < 4; j += 1) {
    secretCode[j] = generateRandomColorID();
  }
  return secretCode;
};


/* Compare Mastermind Secret Code and Codebreaker Guess */
// correct color at the correct position
function isCorrectPosition(secretCode, currentGuess) {
  let correctPositionNumber = 0;
  for (let j = 0; j < 4; j += 1) {
    if (secretCode[j] === currentGuess[j]) {
      correctPositionNumber += 1;
    }
  }
  return correctPositionNumber;
};
// correct color
function isCorrectColor(secretCode, currentGuess) {
  let compareCurrentGuess = [...currentGuess];
  let correctColorNumber = 0;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if (secretCode[i] === compareCurrentGuess[j]) {
        correctColorNumber += 1;
        compareCurrentGuess[j] = -1;
        break;
      }
    }
  }
  return correctColorNumber;
};
// compare
function compareScCg(secretCode, currentGuess, guessNumber, fieldsContent) {

  let correctPosition = isCorrectPosition(secretCode, currentGuess);
  console.log('Correct position: ', correctPosition);

  let correctColor = isCorrectColor(secretCode, currentGuess);
  console.log('Correct color: ', correctColor);

  // draw guessed colors
  for (let j = 0; j < 5; j += 1) {
    if ( j == 4 ) {
      fieldsContent[(j + (guessNumber-1)*5)] = correctColor + ' / ' + correctPosition;
    } else {
      fieldsContent[(j + (guessNumber-1)*5)] = colorVariants[currentGuess[j]];
    }
  }
  drawPlayground(fieldsContent);

  if ( correctPosition == 4 && guessNumber < 11 ) {
    document.querySelector('.result-message').innerHTML = 'You Win!';
  } else if ( correctPosition != 4 && guessNumber > 9 ) {
    document.querySelector('.result-message').innerHTML = 'You Lose!';
  };
  if ( (correctPosition == 4 && guessNumber < 11) || (correctPosition != 4 && guessNumber > 9) ) {
    document.querySelector('.new-game-button').addEventListener('click', function() {
      document.querySelector('.result-wrapper').style.display = 'none';
      letsPlay();
    });
    document.querySelector('.result-wrapper').style.display = 'block';
  };

  return;

};


/* Listen to Codebreaker */
function codebreakerPlays(secretCode, guessNumber, fieldsContent) {
  /* Listening submit click event */
  const submit_button = document.getElementById('submit-guess');
  submit_button.addEventListener('click', function(e) {
    // disable default submit
    e.preventDefault();
    // collecting guessed in currentGuess
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
    compareScCg(secretCode, currentGuess, guessNumber, fieldsContent);
  }, false);
};


/* Reset Playground */
function resetPlayground() {
  let fieldsContent = [];
  for (let i = 0; i < 50; i += 1) { fieldsContent[i] = '-' };
  for (let i = 4; i < 50; i += 5) { fieldsContent[i] = '?' };
  drawPlayground(fieldsContent);
  return fieldsContent;
};

/* Reset GuessNumber */
function resetGuessNumber() {
  let guessNumber = 0;
  return guessNumber;
};

/* Play */
function letsPlay() {
  console.clear();
  let guessNumber = resetGuessNumber();
  let fieldsContent = resetPlayground();
  drawGuessBoard();
  const secretCode = mastermindSecretCode();
  codebreakerPlays(secretCode, guessNumber, fieldsContent);
};
letsPlay();
