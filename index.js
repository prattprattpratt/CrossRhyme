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
          <input type="text" class="guess" oninput="submitGuess(${i})" id="guess-${i}" />
          <span class="guess-status" id="status-${i}"></span>
        </div>
      `
      guessContainer.insertAdjacentHTML('beforeend', guessHTML);
    })

    splitHints = (shouldSplit) => {
      const guessElements = [...document.getElementsByClassName('guess')]
      const guessesAreEmpty = guessElements.every(a => {
        return !a.value
      })
      if (guessesAreEmpty || confirm(`${shouldSplit ? 'Splitting' : 'Combining'} hints will clear current guesses.`)) {
        guessElements.forEach(element => {
          element.value = ''
          element.dispatchEvent(new Event('input')) // manually trigger change event to clear guess status
        })
      } else {
        const settingInput = document.getElementById(`setting-split-hints`)
        settingInput.checked = !shouldSplit
        localStorage.setItem('split-hints', !shouldSplit)
      }
    }

    // custom local storage set item that adds an onchange event
    localStorageSetItem = (key, value) => {
      localStorage.setItem(key, value)

      const event = new Event('localStorageSetItemCustom')
      event.key = key
      event.value = value
      document.dispatchEvent(event)
    }

    localStorageSetItemHandler = (e) => {
      switch (e.key) {
        case 'split-hints':
          splitHints(e.value)
          break
        default:
          break
      }
    }

    document.addEventListener('localStorageSetItemCustom', localStorageSetItemHandler)
  }
  setup()
  
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
    const currentClueValue = document.getElementById('clue').textContent
    const currentPuzzle = JSON.parse(localStorage.getItem('puzzle-data')).find(p => {
      return !!p.clue[currentClueValue]
    })
    const answer = currentPuzzle.rhymes[Array.from(Object.keys(currentPuzzle.rhymes))[guessNumber - 1]]

    const cleanedGuess = guess.replace(/ /, '').toLocaleLowerCase()
    const cleanedAnswer = answer.replace(/ /, '').toLocaleLowerCase()

    let numLettersCorrect = 0
    for (let i = 0; i < cleanedGuess.length; i++) {
      for (let j = 0; j < cleanedAnswer.length; j++) {
        cleanedGuess[i] === cleanedAnswer[j] && i === j && numLettersCorrect++
      }
    }

    return numLettersCorrect >= cleanedAnswer.length * 1.0 // lower this number to give more leeway for misspellings
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
    statusElement.classList.remove('correct', 'incorrect')
    !!statusClass && statusElement.classList.add(statusClass)
  }

  toggleSettings = (setting) => {
    const settingInput = document.getElementById(`setting-${setting}`)
    const settingValue = settingInput.checked

    localStorageSetItem(setting, settingValue)
  }
}