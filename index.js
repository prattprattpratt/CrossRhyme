window.onload = () => {
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

  httpRequest = (url, method, callback) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp.responseText);
    }
    xmlHttp.open(method, url, true); // true for asynchronous 
    xmlHttp.send(null); // null for GET
  }
}