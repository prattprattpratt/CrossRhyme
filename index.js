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
    const currentClueValue = document.getElementById('clue').textContent
    const currentPuzzle = JSON.parse(localStorage.getItem('puzzle-data')).find(p => {
      return !!p.clue[currentClueValue]
    })
    let answer = guessType === 'rhyme' ?
      currentPuzzle.rhymes[Array.from(Object.keys(currentPuzzle.rhymes))[rhymeNumber - 1]]
      : currentPuzzle.clue[currentClueValue]
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
  }
}