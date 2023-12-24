settingsSetup = () => {
  toggleSplitHints = (shouldSplit) => {
    const guessElements = [...document.getElementsByClassName('guess')]
    const guessWithStatusElements = [...document.getElementsByClassName('guess-with-status')]
    const guessesAreEmpty = guessElements.every(a => {
      return !a.value
    })
    if (guessesAreEmpty || confirm(`${shouldSplit ? 'Splitting' : 'Combining'} hints will clear current guesses.`)) {
      guessElements.forEach(element => {
        element.value = ''
        element.dispatchEvent(new Event('input')) // manually trigger change event to clear guess status
      })
      guessWithStatusElements.forEach(element => {
        element.classList.toggle('hidden')
      })
      localStorage.setItem('split-hints', shouldSplit)
    } else {
      const settingInput = document.getElementById(`setting-split-hints`)
      settingInput.checked = !shouldSplit
    }
  }

  // custom local storage setItem that adds an onchange event listener
  localStorageSetItem = (key, value, options) => {
    const { conditionallyUpdateLocalStorage } = options
    !conditionallyUpdateLocalStorage && localStorage.setItem(key, value)

    const event = new Event('localStorageSetItemCustom')
    event.key = key
    event.value = value
    document.dispatchEvent(event)
  }

  localStorageSetItemHandler = (e) => {
    switch (e.key) {
      case 'split-hints':
        toggleSplitHints(e.value)
        break
      default:
        break
    }
  }

  document.addEventListener('localStorageSetItemCustom', localStorageSetItemHandler)

  toggleSettings = (settingName) => {
    const settingInput = document.getElementById(`setting-${settingName}`)
    const settingValue = settingInput.checked

    localStorageSetItem(settingName, settingValue, { conditionallyUpdateLocalStorage: true })
  }
}