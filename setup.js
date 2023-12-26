pageSetup = () => {
  const puzzleData = [
    {
      clue: {
        'Austrian National Flower': 'edelweiss',
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
        'What Peter Pan says to get his rival\'s attention': 'look hook',
      }
    },
  ]
  localStorage.setItem('puzzle-data', JSON.stringify(puzzleData))

  const firstPuzzle = puzzleData[Math.floor((Math.random() * puzzleData.length))]

  const clueHint = Object.keys(firstPuzzle.clue)[0]
  document.getElementById('clue').textContent = clueHint

  const clue = firstPuzzle.clue[clueHint]
  const clueGuessContainer = document.getElementById('clue-guess-container')
  const clueGuessHTML = `
    <p>Guess clue:</p>
    <div class="guess-with-status${clue.split(' ').length > 1 ? ' combined' : ''}">
      <input type="text" oninput="submitGuess('clue')" id="guess-clue" />
      <span class="guess-status" id="status-clue"></span>
    </div>
    ${clue.split(' ').length > 1 ? clue.split(' ').map((_, j) => {
      j = j + 1
      return `
        <div class="guess-with-status split hidden">
          <input type="text" class="guess guess-part" oninput="submitGuess('clue',${undefined},${j})" id="guess-clue-part-${j}" />
          <span class="guess-status" id="status-clue-${j}"></span>
        </div>
      `
    }).join('') : ''}
  `
  clueGuessContainer.insertAdjacentHTML('beforeend', clueGuessHTML)

  Array.from(Object.keys(firstPuzzle.rhymes)).forEach((rhyme, i) => {
    i = i + 1
    const guessContainer = document.getElementById('guess-container')
    const guessHTML = `
      <div class="form" id="form-guess-${i}">
        <h3 class="hint" id="hint-${i}">Rhyme #${i}: ${rhyme}</h3>
        <div class="guess-with-status combined">
          <input type="text" class="guess guess-whole" oninput="submitGuess('rhyme',${i})" id="guess-${i}" />
          <span class="guess-status" id="status-${i}"></span>
        </div>
        ${firstPuzzle.rhymes[rhyme].split(' ').length > 1 ? firstPuzzle.rhymes[rhyme].split(' ').map((_, j) => {
          j = j + 1
          return `
            <div class="guess-with-status split hidden${j === 1 ? ' ml-auto' : ''}">
              <input type="text" class="guess guess-part" oninput="submitGuess('rhyme',${i},${j})" id="guess-${i}-part-${j}" />
              <span class="guess-status" id="status-${i}-${j}"></span>
            </div>
          `
        }).join('') : ''}
      </div>
    `
    guessContainer.insertAdjacentHTML('beforeend', guessHTML)
  })

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
}