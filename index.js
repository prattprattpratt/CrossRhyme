window.onload = () => {
  console.log('index')
  setup = () => {
    const puzzleData = [
      {
        clue: {
          'Austrian National Flower': 'eidelweiss',
        },
        rhymes: {
          'Furniture store robbery': 'table heist',
          'Cutting a wire in half': 'cable splice',
        }
      },
      {
        clue: {
          'Recipe': 'cook book',
        },
        rhymes: {
          'Captured chess piece': 'took rook',
          'Criminal in a small space': 'crook nook',
          'What Peter Pan says to get his rival’s attention': 'look hook',
        }
      },
    ]
    localStorage.setItem('puzzle-data', JSON.stringify(puzzleData))

    const firstPuzzle = puzzleData[Math.floor((Math.random() * puzzleData.length))]

    document.getElementById('clue').textContent = Object.keys(firstPuzzle.clue)[0]
    Array.from(Object.keys(firstPuzzle.rhymes)).forEach((rhyme, i) => {
      i = i + 1
      const guessContainer = document.getElementById('guess-container');
      const guessHTML = `
        <div class="form" id="form-guess-${i}">
          <h3 class="hint" id="hint-${i}">Hint #${i}: ${rhyme}</h3>
          <input type="text" oninput="submitGuess(${i})" id="guess-${i}" />
          <span id="status-${i}"></span>
        </div>
      `
      guessContainer.insertAdjacentHTML('beforeend', guessHTML);
    })
  }
  setup()

  window.addEventListener('storage', (e) => {
    console.log(e)
  });
  
  submitGuess = (guessNumber) => {
    const guessInput = document.getElementById(`guess-${guessNumber}`)
    const guess = guessInput.value

    if (guess === '') {
      setStatus(guessNumber, 'blank')
      return
    }
    
    setStatus(
      guessNumber, 
      guessIsCorrect(guess, guessNumber) ? 'correct' : 'incorrect'
    )
  }

  guessIsCorrect = (guess, guessNumber) => {
    let answer = ''
    switch (guessNumber) {
      case 1:
        answer = 'table heist'
        break
      case 2:
        answer = 'cable splice'
        break
      default:
        break
    }

    const cleanedGuess = guess.replace(/ /, '').toLocaleLowerCase()
    const cleanedAnswer = answer.replace(/ /, '').toLocaleLowerCase()

    let numLettersCorrect = 0
    for (let i = 0; i < cleanedGuess.length; i++) {
      for (let j = 0; j < cleanedAnswer.length; j++) {
        cleanedGuess[i] === cleanedAnswer[j] && i === j && numLettersCorrect++
      }
    }

    return numLettersCorrect > cleanedAnswer.length * 0.8
  }

  setStatus = (guessNumber, status) => {
    let statusText = ''
    let statusClass = ''

    switch (status) {
      case 'correct':
        statusText = 'Correct!'
        statusClass = 'correct'
        break
      case 'incorrect':
        statusText = 'Incorrect.'
        statusClass = 'incorrect'
        break
      default:
        break
    }

    const statusElement = document.getElementById(`status-${guessNumber}`)
    statusElement.textContent = statusText
    statusElement.classList = statusClass
  }

  toggleSettings = (setting) => {
    const settingInput = document.getElementById(`setting-${setting}`)
    const settingValue = settingInput.checked

    localStorage.setItem(setting, settingValue)
  }
}