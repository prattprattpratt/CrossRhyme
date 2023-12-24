window.onload = () => {
  pageSetup()
  settingsSetup()
  
  submitGuess = (guessNumber, nthWord) => {
    const guessElementId = nthWord ? `guess-${guessNumber}-part-${nthWord}` : `guess-${guessNumber}`
    const guessInput = document.getElementById(guessElementId)
    const guess = guessInput.value

    if (guess === '') {
      setStatus(guessNumber, nthWord, 'blank')
      return
    }
    
    setStatus(
      guessNumber,
      nthWord,
      guessIsCorrect(guess, guessNumber, nthWord) ? 'correct' : 'incorrect'
    )
  }

  guessIsCorrect = (guess, guessNumber, nthWord) => {
    const currentClueValue = document.getElementById('clue').textContent
    const currentPuzzle = JSON.parse(localStorage.getItem('puzzle-data')).find(p => {
      return !!p.clue[currentClueValue]
    })
    let answer = currentPuzzle.rhymes[Array.from(Object.keys(currentPuzzle.rhymes))[guessNumber - 1]]
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

  setStatus = (guessNumber, partNumber, status) => {
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

    const statusElementId = partNumber ? `status-${guessNumber}-${partNumber}` : `status-${guessNumber}`
    const statusElement = document.getElementById(statusElementId)
    statusElement.textContent = statusText
    statusElement.classList.remove('correct', 'incorrect')
    !!statusClass && statusElement.classList.add(statusClass)
  }
}