window.onload = () => {
  pageSetup()
  renderModals()
  settingsSetup()
  setActivePuzzle(1)
  
submitGuess = (e) => {
    const guessInput = e.target
    const guess = guessInput.value

    if (guess === '') {
      setStatus(guessInput, 'blank')
      return
    }

    setStatus(
      guessInput,
      guessIsCorrect(guessInput, guess) ? 'correct' : 'incorrect'
    )
  }

  setStatus = (guessInput, status) => {
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

    const statusElementId = `${guessInput.id}-status`
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

  guessIsCorrect = (guessElement, guess) => {
    let answer = guessElement.dataset.answer

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

  revealClue = () => {
    if (confirm('Are you sure you want to reveal the clue?')) {
      // get the clue
      const currentClueHint = document.getElementById('clue').textContent.split(': ')[1]
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
      timerContainer.setAttribute('timeToComplete', secondsElapsed.toString() + '.' + msRemainder.toString().padEnd(3, '0'))
    }, 1)
    const puzzleStatus = document.getElementById('puzzle-status')
    puzzleStatus.setAttribute('timerId', timer)
  }

  stopTimer = () => {
    const puzzleStatus = document.getElementById('puzzle-status')
    window.clearInterval(puzzleStatus.getAttribute('timerId'))
  }

  startPuzzle = () => {
    startTimer()
    const preStartBarrier = document.getElementById('pre-start-barrier')
    preStartBarrier.classList.add('hidden')
  }

  nextPuzzle = () => {
    const currentClueHint = document.getElementById('clue').textContent.split(': ')[1]
    const currentPuzzleIndex = JSON.parse(localStorage.getItem('puzzle-data')).findIndex(p => {
      return !!p.clue[currentClueHint]
    })
    setActivePuzzle(currentPuzzleIndex + 1)
  }

  logPuzzleStats = () => {
    const currentClueHint = document.getElementById('clue').textContent.split(': ')[1]
    const currentPuzzleIndex = JSON.parse(localStorage.getItem('puzzle-data')).findIndex(p => {
      return !!p.clue[currentClueHint]
    })

    const timerContainer = document.getElementById('timer-container')
    const timeToComplete = Number(timerContainer.getAttribute('timeToComplete'))

    const currentPuzzleStats = {
      index: currentPuzzleIndex,
      clue: currentClueHint,
      secondsToComplete: timeToComplete,
    }

    const allPuzzleStats = JSON.parse(localStorage.getItem('puzzle-stats')) || []
    allPuzzleStats.forEach((ps, i) => {
      if (ps.clue === currentClueHint) {
        allPuzzleStats.splice(i, 1)
      }
    })
    allPuzzleStats.push(currentPuzzleStats)
    localStorage.setItem('puzzle-stats', JSON.stringify(allPuzzleStats))
  }

  puzzleCompleted = () => {
    stopTimer()
    const puzzleStatus = document.getElementById('puzzle-status')
    puzzleStatus.textContent = 'Well done!'

    // disable the guess inputs
    const guessElements = [...document.getElementsByClassName('guess')]
    guessElements.forEach(elem => {
      elem.disabled = 'true'
    })

    logPuzzleStats()
  }

  populateStats = () => {
    const puzzleStats = JSON.parse(localStorage.getItem('puzzle-stats')) || []
    const numPuzzlesCompleted = puzzleStats.length
    let minTimeToComplete
    let totalTimeToComplete = 0
    puzzleStats.forEach(ps => {
      const time = ps.secondsToComplete
      if (!minTimeToComplete || time < minTimeToComplete) {
        minTimeToComplete = time
      }
      totalTimeToComplete += time
    }, 0)
    const avgTimeToComplete = totalTimeToComplete / numPuzzlesCompleted

    const numPuzzlesCompletedElement = document.getElementById('stat-value-num-completed')
    const avgTimeElement = document.getElementById('stat-value-avg-time')
    const minTimeElement = document.getElementById('stat-value-min-time')

    numPuzzlesCompletedElement.textContent = numPuzzlesCompleted
    avgTimeElement.textContent = !!avgTimeToComplete ? `${avgTimeToComplete.toFixed(3)}s` : 'N/A'
    minTimeElement.textContent = !!minTimeToComplete ? `${minTimeToComplete}s` : 'N/A'
  }

  toggleModal = (showOrHide, modalName) => {
    const shouldShow = showOrHide === 'open'
    const modal = document.getElementById(`${modalName}-modal`)
    shouldShow && modal.classList.remove('closed')
    !shouldShow && modal.classList.add('closed')

    switch (modalName) {
      case 'stats':
        populateStats()
        break
      case 'settings':

        break
      default:
        break
    }

    if (`${showOrHide} ${modalName}` === 'close how-it-works') {
      stopTutorial()
    }
  }

  togglePlayTutorialButtons = () => {
    const playTutorialButton = document.getElementById('play-tutorial-button')
    const stopTutorialButton = document.getElementById('stop-tutorial-button')
    playTutorialButton.classList.toggle('hidden')
    stopTutorialButton.classList.toggle('hidden')
  }

  playTutorial = () => {
    togglePlayTutorialButtons()
    const howItWorksModal = document.getElementById('how-it-works-modal')

    howItWorksModal.classList.add('tutorial-active')

    window.setTimeout(() => {
      const tutorialClue = document.getElementById('tutorial-clue')
      tutorialClue.classList.remove('hide')
      const tutorialClueGuess = document.getElementById('tutorial-clue-guess')
      tutorialClueGuess.classList.remove('hide')
      
      const startTime = Date.now()
      window.tutorialTimer = window.setInterval(() => {
        const msElapsed = Date.now() - startTime
        if (msElapsed >= 5000) {
          window.clearInterval(window.tutorialTimer)
          const hintPopup = document.getElementById('tutorial-clue-hint')
          hintPopup.classList.remove('hide')
        }
      }, 1000)
    }, 1000)
  }

  stopTutorial = () => {
    const howItWorksModal = document.getElementById('how-it-works-modal')

    if (howItWorksModal.classList.contains('tutorial-active')) {
      togglePlayTutorialButtons()
      howItWorksModal.classList.remove('tutorial-active')
    }
  }

  // TODO: TUTORIAL (GIF?, POPUP WALKTHROUGH?)
  // TODO: LOOK GOOD
  // TODO: SHARE RESULTS
  // TODO: PUZZLES FROM SHEET/OTHER JOE-EDITABLE DATA SOURCE
  // TODO: REORGANIZE CODE AGAIN (abstract get current puzzle, more intuitive file structure)
  // SETTINGS DESCRIPTION/PICTURE/GIF?
  // SETTINGS IN LOCAL STORAGE TO APPLY ON PUZZLE SWITCH
  // SETTING ICON FOR SHARING/KNOW WHAT'S APPLIED IN-PUZZLE
  // CREATE YOUR OWN PUZZLE WITH SHAREABLE LINK
  // LEADERBOARD?
  // ANIMATE TOOL ICONS TO X
  // MOBILE
}