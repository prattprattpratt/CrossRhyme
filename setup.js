pageSetup = () => {
  const puzzleData = [
    {
      clue: {
        'What a brunette has': 'brown hair',
      },
      rhymes: {
        'City festival': 'town fair',
        'Dress rip': 'gown tear',
        'Hideout for an evil person, place, or thing': 'noun lair',
      }
    },
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
  const clueNumber = puzzleData.findIndex(puzzle => {
    return !!puzzle.clue[clueHint]
  })
  document.getElementById('clue').textContent = `Clue #${clueNumber}: ${clueHint}`

  const clue = activePuzzle.clue[clueHint]
  const clueGuessContainer = document.getElementById('clue-guess-container')
  const clueGuessHTML = `
    <p>Guess clue:</p>
    <div class="guess-with-status${clue.split(' ').length > 1 ? ' combined' : ''}">
      <input type="text" oninput="submitGuess(event)" id="guess-clue" data-answer="${clue}" />
      <span class="guess-status" id="guess-clue-status"></span>
    </div>
    ${clue.split(' ').length > 1 ? clue.split(' ').map((answerWord, j) => {
      j = j + 1
      return `
        <div class="guess-with-status split hidden">
          <input type="text" class="guess guess-part" oninput="submitGuess(event)" id="guess-clue-part-${j}" data-answer="${answerWord}" />
          <span class="guess-status" id="guess-clue-part-${j}-status"></span>
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
      <div class="form">
        <h3 class="hint" id="hint-${i}">Rhyme #${i}: ${rhyme}</h3>
        <div class="guess-with-status${answer.split(' ').length > 1 ? ' combined' : ''}">
          <input type="text" class="guess guess-whole" oninput="submitGuess(event)" id="guess-${i}" data-answer="${answer}" />
          <span class="guess-status" id="guess-${i}-status"></span>
        </div>
        ${answer.split(' ').length > 1 ? answer.split(' ').map((answerWord, j) => {
          j = j + 1
          return `
            <div class="guess-with-status split hidden${j === 1 ? ' ml-auto' : ''}">
              <input type="text" class="guess guess-part" oninput="submitGuess(event)" id="guess-${i}-part-${j}" data-answer="${answerWord}" />
              <span class="guess-status" id="guess-${i}-part-${j}-status"></span>
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
  const puzzleData = JSON.parse(localStorage.getItem('puzzle-data'))
  const tutorialPuzzle = puzzleData[0]
  const tutorialPuzzleClue = Object.keys(tutorialPuzzle.clue)[0]

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
    `,
    'how-it-works': `
      <h2>How it works</h2>
      <p>
        Rhyme Words is like a crossword - you guess words/phrases based on a clue.
        Each puzzle has three words/phrases that rhyme with each other.
        Each puzzle also has a "major clue" that is a more-common word/phrase, and which rhymes with the other three words/phrases.
      </p>
      <button id="play-tutorial-button" onclick="playTutorial()">Play tutorial</button>
      <button id="stop-tutorial-button" class="hidden" onclick="stopTutorial()">Stop tutorial</button>
      <div id="tutorial-container">
        <h2 class="hide" id="tutorial-clue">Clue #1: ${tutorialPuzzleClue}</h2>
        <div class="guess-with-status hide" id="tutorial-clue-guess">
          <input type="text" class="guess guess-whole" oninput="submitGuess(event)" id="guess-tutorial-clue" data-answer="${tutorialPuzzle.clue[tutorialPuzzleClue]}" />
          <span class="guess-status" id="guess-tutorial-clue-status"></span>
          <div class="tutorial-hint-popup hide" id="tutorial-clue-hint">Type your answer here</div>
        </div>
        ${Object.keys(tutorialPuzzle.rhymes).map((rhymeHint, i) => {
          i += 1
          return `
            <div class="form hide">
              <h3 class="hint" id="hint-tutorial-${i}">Rhyme #${i}: ${rhymeHint}</h3>
              <div class="guess-with-status">
                <input type="text" class="guess guess-whole" oninput="submitGuess(event)" id="guess-tutorial-rhyme-${i}" data-answer="${tutorialPuzzle.rhymes[rhymeHint]}" />
                <span class="guess-status" id="guess-tutorial-rhyme-${i}-status"></span>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `
  };

  ['settings', 'stats', 'how-it-works'].forEach(modalName => {
    const modalHTML = `
      <div class="modal closed" id="${modalName}-modal">
        <svg class="close-modal" onclick="toggleModal('close', '${modalName}')" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="game-icon" data-testid="icon-close"><path fill="var(--color-tone-1)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        ${modalBodyHTML[modalName]}
      </div>
    `

    modalsContainer.insertAdjacentHTML('beforeend', modalHTML)
  })
}