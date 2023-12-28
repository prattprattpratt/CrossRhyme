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
}

setActivePuzzle = (index) => {
  const puzzleData = JSON.parse(localStorage.getItem('puzzle-data'))
  const activePuzzle = puzzleData[index]

  const clueHint = Object.keys(activePuzzle.clue)[0]
  const clueNumber = 1 + puzzleData.findIndex(puzzle => {
    return !!puzzle.clue[clueHint]
  })
  document.getElementById('clue').textContent = `Clue #${clueNumber}: ${clueHint}`

  const clue = activePuzzle.clue[clueHint]
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
  clueGuessContainer.innerHTML = clueGuessHTML

  const rhymeGuessContainer = document.getElementById('rhyme-guess-container')
  let guessHTML = ''
  Array.from(Object.keys(activePuzzle.rhymes)).forEach((rhyme, i) => {
    i = i + 1
    const answer = activePuzzle.rhymes[rhyme]
    guessHTML += `
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
  })
  rhymeGuessContainer.innerHTML = guessHTML
}

renderModals = () => {
  const modalsContainer = document.getElementById('modals-container')

  const modalBodyHTML = {
    'stats': `
      <h2>My stats</h2>
      <div class="stat">
        <p>Puzzles completed:</p>
        <p class="stat-value" id="stat-value-num-completed"></p>
      </div>
      <div class="stat">
        <p>Average puzzle completion time:</p>
        <p class="stat-value" id="stat-value-avg-time"></p>
      </div>
      <div class="stat">
        <p>Fastest puzzle completion time:</p>
        <p class="stat-value" id="stat-value-min-time"></p>
      </div>
    `,
    'settings': `
      <h2>Settings</h2>
      <div class="setting">
        <p>Split hints by word</p>
        <input type="checkbox" oninput="toggleSettings('split-hints')" id="setting-split-hints" />
      </div>
      <div class="setting" id="setting-guess-clue-container">
        <p>Allow clue guesses</p>
        <input type="checkbox" oninput="toggleSettings('guess-clue')" id="setting-guess-clue" />
      </div>
      <div class="setting" id="setting-reveal-clue-container">
        <p>Allow clue reveal</p>
        <input type="checkbox" oninput="toggleSettings('reveal-clue')" id="setting-reveal-clue" />
      </div>
    `
  };

  ['settings', 'stats'].forEach(modalName => {
    const modalHTML = `
      <div class="modal closed" id="${modalName}-modal">
        <svg class="close-modal" onclick="toggleModal('close', '${modalName}')" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="game-icon" data-testid="icon-close"><path fill="var(--color-tone-1)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        ${modalBodyHTML[modalName]}
      </div>
    `

    modalsContainer.insertAdjacentHTML('beforeend', modalHTML)
  })
}