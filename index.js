window.onload = () => {
  submitGuess = (guessNumber) => {
    const guessInput = document.getElementById(`guess-${guessNumber}`)
    const guess = guessInput.value

    let correctAnswer = ''
    switch (guessNumber) {
      case 1:
        correctAnswer = 'table heist'
        break
      case 2:
        correctAnswer = 'cable splice'
        break
      default:
        break
    }
    const guessIsCorrect = guess.toLocaleLowerCase() === correctAnswer.toLocaleLowerCase()
    const statusElement = document.getElementById(`status-${guessNumber}`)
    statusElement.textContent = guessIsCorrect ? 'Correct!' : 'Incorrect.'
    statusElement.classList = guessIsCorrect ? 'correct' : 'incorrect'
    return false
  }
}