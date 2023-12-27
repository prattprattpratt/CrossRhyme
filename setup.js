pageSetup = () => {
  const puzzleData = [
    {
      clue: {
        'Austrian National Flower': 'edelweiss',
      },
      rhymes: {
        'Furniture store robbery': 'table heist',
        'Cutting a wire in half': 'cable splice',
        'Deadly herb': 'fatal spice',
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
    {
      clue: {
        'A Cluster of Steps': 'cook book',
      },
      rhymes: {
        'Pepper spray for grizzlies': 'bear mace',
        'An impartial contest': 'fair race',
        'To occupy the same location as someone else': 'share space',
      }
    },
    {
      clue: {
        'Rum-puh-pum-pum-er': 'drummer boy',
      },
      rhymes: {
        'Less smart trick': 'dumber ploy',
        'Gas-guzzler plaything': 'hummer toy',
        'Pond fish that has been in the cold for longer': 'number koi',
      }
    },
    {
      clue: {
        'Not Android': 'iPhone',
      },
      rhymes: {
        'Propensity to get the same score as an opponent': 'tie prone',
        'A place for the boys': 'guy zone',
        'Questioning the rationale of lending': 'why loan',
      }
    },
  ]
  localStorage.setItem('puzzle-data', JSON.stringify(puzzleData))

  const firstPuzzle = puzzleData[Math.floor((Math.random() * puzzleData.length))]

  const clueHint = Object.keys(firstPuzzle.clue)[0]
  const clueNumber = 1 + puzzleData.findIndex(puzzle => {
    return !!puzzle.clue[clueHint]
  })
  document.getElementById('clue').textContent = `Clue #${clueNumber}: ${clueHint}`

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
    const answer = firstPuzzle.rhymes[rhyme]
    const guessContainer = document.getElementById('rhyme-guess-container')
    const guessHTML = `
      <div class="form" id="form-guess-${i}">
        <h3 class="hint" id="hint-${i}">Rhyme #${i}: ${rhyme}</h3>
        <div class="guess-with-status${answer.split(' ').length > 1 ? ' combined' : ''}">
          <input type="text" class="guess guess-whole" oninput="submitGuess('rhyme',${i})" id="guess-${i}" />
          <span class="guess-status" id="status-${i}"></span>
        </div>
        ${answer.split(' ').length > 1 ? answer.split(' ').map((_, j) => {
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
}