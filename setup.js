pageSetup = () => {
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
        'What Peter Pan says to get his rival\'s attention': 'look hook',
      }
    },
  ]
  localStorage.setItem('puzzle-data', JSON.stringify(puzzleData))

  const firstPuzzle = puzzleData[Math.floor((Math.random() * puzzleData.length))]

  document.getElementById('clue').textContent = Object.keys(firstPuzzle.clue)[0]
  Array.from(Object.keys(firstPuzzle.rhymes)).forEach((rhyme, i) => {
    i = i + 1
    const guessContainer = document.getElementById('guess-container')
    const guessHTML = `
      <div class="form" id="form-guess-${i}">
        <h3 class="hint" id="hint-${i}">Hint #${i}: ${rhyme}</h3>
        <div class="guess-with-status">
          <input type="text" class="guess guess-whole" oninput="submitGuess(${i})" id="guess-${i}" />
          <span class="guess-status" id="status-${i}"></span>
        </div>
        ${firstPuzzle.rhymes[rhyme].split(' ').map((word, j) => {
          j = j + 1
          return `
            <div class="guess-with-status hidden">
              <input type="text" class="guess guess-part" oninput="submitGuess(${i},${j})" id="guess-${i}-part-${j}" />
              <span class="guess-status" id="status-${i}-${j}"></span>
            </div>
          `
        }).join('')}
      </div>
    `
    guessContainer.insertAdjacentHTML('beforeend', guessHTML)
  })
}