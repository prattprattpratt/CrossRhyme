window.onload = () => {
  pageSetup()
  settingsSetup()
  
  submitGuess = (guessType, rhymeNumber, nthWord) => {
    const guessElementId = nthWord ? `guess-${rhymeNumber || guessType}-part-${nthWord}` : `guess-${rhymeNumber || guessType}`
    const guessInput = document.getElementById(guessElementId)
    const guess = guessInput.value

    if (guess === '') {
      setStatus(guessType, rhymeNumber, nthWord, 'blank')
      return
    }
    
    setStatus(
      guessType,
      rhymeNumber,
      nthWord,
      guessIsCorrect(guessType, guess, rhymeNumber, nthWord) ? 'correct' : 'incorrect'
    )
  }

  guessIsCorrect = (guessType, guess, rhymeNumber, nthWord) => {
    const currentClueHint = document.getElementById('clue').textContent.split(': ')[1]
    const currentPuzzle = JSON.parse(localStorage.getItem('puzzle-data')).find(p => {
      return !!p.clue[currentClueHint]
    })
    let answer = guessType === 'rhyme' ?
      currentPuzzle.rhymes[Array.from(Object.keys(currentPuzzle.rhymes))[rhymeNumber - 1]]
      : currentPuzzle.clue[currentClueHint]
    if (nthWord) {
      answer = answer.split(' ')[nthWord - 1]
    }

    const cleanedGuess = guess.replace(/ /, '').toLocaleLowerCase()
    const cleanedAnswer = answer.replace(/ /, '').toLocaleLowerCase()

    let numLettersCorrect = 0
    for (let i = 0; i < cleanedGuess.length; i++) {
      for (let j = 0; j < cleanedAnswer.length; j++) {
        cleanedGuess[i] === cleanedAnswer[j] && i === j && numLettersCorrect++
      }
    }

    return numLettersCorrect >= cleanedAnswer.length * 1.0 // lower this number to give more leeway for misspellings. TODO: smarter way to do this.
  }

  setStatus = (guessType, rhymeNumber, nthWord, status) => {
    let statusText = ''
    let statusClass = ''

    switch (status) {
      case 'correct':
        statusText = '✅'
        statusClass = 'correct'
        break
      case 'incorrect':
        statusText = '❌'
        statusClass = 'incorrect'
        break
      default:
        break
    }

    const statusElementId = nthWord ? `status-${rhymeNumber || guessType}-${nthWord}` : `status-${rhymeNumber || guessType}`
    const statusElement = document.getElementById(statusElementId)
    statusElement.textContent = statusText
    statusElement.classList.remove('correct', 'incorrect')
    !!statusClass && statusElement.classList.add(statusClass)

    const guessStatusElements = document.querySelectorAll('#rhyme-guess-container .guess-with-status:not(.hidden) .guess-status')
    const puzzleComplete = Array.from(guessStatusElements).every(e => {
      return e.classList.contains('correct')
    })
    if (puzzleComplete) {
      puzzleCompleted()
    }
  }

  revealClue = () => {
    if (confirm('Are you sure you want to reveal the clue?')) {
      // get the clue
      const currentClueHint = document.getElementById('clue').textContent
      const currentPuzzle = JSON.parse(localStorage.getItem('puzzle-data')).find(p => {
        return !!p.clue[currentClueHint]
      })
      const currentClue = currentPuzzle.clue[currentClueHint]
      // set the clue value, don't allow changes to the clue input value
      const clueGuessElement = document.getElementById('guess-clue')
      clueGuessElement.value = currentClue
      clueGuessElement.disabled = 'true'

      // make sure the clue guess container is showing
      const clueGuessContainer = document.getElementById('clue-guess-container')
      clueGuessContainer.classList.remove('hidden')

      // make sure the current clue guess status is blank
      const clueGuessStatusElement = document.getElementById('status-clue')
      clueGuessStatusElement.textContent = ''

      // make sure the single clue input is showing
      const guessWithStatusElements = [...document.querySelectorAll('.clue-guess-container .guess-with-status')]
      guessWithStatusElements.forEach(element => {
        if (element.classList.contains('split')) {
          element.classList.add('hidden')
          console.log(element.firstElementChild)
          element.firstElementChild.value = ''
        } else {
          element.classList.remove('hidden')
        }
        // disable combined/split toggle-ability
        element.classList.remove('combined', 'split')
      })

      // hide the button
      toggleRevealClueOption()

      // disable the clue-related settings that are no longer relevant
      const revealClueSettingContainer = document.getElementById('setting-reveal-clue-container')
      revealClueSettingContainer.classList.add('disabled')
      const guessClueSettingContainer = document.getElementById('setting-guess-clue-container')
      guessClueSettingContainer.classList.add('disabled')
    }
  }

  startTimer = () => {
    const startTime = Date.now()
    const timerContainer = document.getElementById('timer-container')
    const timer = window.setInterval(() => {
      let msElapsed = Date.now() - startTime
      const minutesElapsed = Math.floor(msElapsed / 60_000)
      const secondsElapsed = Math.floor(msElapsed / 1000)
      const secondsRemainder = Math.floor(msElapsed % 60_000 / 1000)
      const msRemainder = msElapsed % 1000
      if (secondsElapsed < 10) {
        timerContainer.textContent = 'Elapsed time: ' + secondsElapsed.toString() + '.' + msRemainder.toString().padEnd(3, '0') + 's'
      } else if (secondsElapsed < 60) {
        timerContainer.textContent = 'Elapsed time: ' + secondsElapsed.toString() + 's'
      } else {
        timerContainer.textContent = 'Elapsed time: ' + minutesElapsed.toString() + 'm ' + secondsRemainder.toString() + 's'
      }
    }, 1)
    const puzzleStatus = document.getElementById('puzzle-status')
    puzzleStatus.setAttribute('timerId', timer)
  }

  startPuzzle = () => {
    startTimer()
    const preStartBarrier = document.getElementById('pre-start-barrier')
    preStartBarrier.classList.add('hidden')
  }

  puzzleCompleted = () => {
    const puzzleStatus = document.getElementById('puzzle-status')
    puzzleStatus.textContent = 'Well done!'

    //stop the timer
    window.clearInterval(puzzleStatus.getAttribute('timerId'))

    // disable the guess inputs
    const guessElements = [...document.getElementsByClassName('guess')]
    guessElements.forEach(elem => {
      elem.disabled = 'true'
    })
  }

  // TODO: ONE-WORD RHYME
  // TODO: NEXT PUZZLE
  // TODO: STATS (FASTEST PUZZLE, AVERAGE TIME)
  // TODO: SETTINGS MODAL
  // TODO: TUTORIAL (GIF?, POPUP WALKTHROUGH?)
  // TODO: LOOK GOOD
  // TODO: SHARE RESULTS
  // TODO: PUZZLES FROM SHEET/OTHER JOE-EDITABLE DATA SOURCE
}