const emojis = ['🎄', '🎁', '🎅', '☃️']; // Your set of emojis

/**
 *🎄 Requirements:
 * - This is a classic "Find the Pair" game with a christmas theme.
 * - The player should be able to reveal cards by clicking on them.
 * - When the player reveals one card, it should stay revealed until a second card is revealed.
 * - When the player reveals two cards:
 *   - If they are the same, they should remain revealed for the rest of the game.
 *   - If they are different, they should be flipped back to hidden.
 * - The cards should be shuffled at the start of each game.
 */

/**
 * 🎅 Stretch Goals:
 * - Add a point system where points are awarded for each correctly revealed pair 
 *   and deducted for each incorrect pair (you decide the exact points for each action).
 * - Implement a high-score system using the browser's local storage.
 * - Add a "Restart Game" button that appears when the game ends so the user can start over.
 */

const gameBoard = document.getElementById('game-board')
const highestScorer = document.getElementById('highest-scorer')

// duplicating each element within the array for rendering
emojis.forEach(emoji => {
  emojis.push(emoji)
})

shuffle(emojis)
// console.log(emojis)

gameBoard.innerHTML = emojis.map((emoji, emoId) => `
    <div class='card' data-emoji='${emoji}' id='emo-${emoId}'></div>
`).join('')
const cards = document.getElementsByClassName('card')

let firstCard
let secondCard
let matchedPairs = 0
let totalScore = 0
const pointsOnCorrect = 3
const pointsOnWrong = -1

handleHighScore()

for (let card of cards) {
  card.addEventListener('click', () => {
    let clickedCard = card.getAttribute('id')

    // When one card is clicked
    if (firstCard) {
      if (firstCard === clickedCard) return
      secondCard = clickedCard
    } else {
      firstCard = clickedCard
    }
    card.classList.add('revealed')
    card.innerHTML = card.dataset.emoji

    // When 2 consecutive cards are clicked
    if (firstCard && secondCard) {
      let firstCardNode = document.getElementById(firstCard)
      let secondCardNode = document.getElementById(secondCard)

      if (firstCardNode.dataset.emoji === secondCardNode.dataset.emoji) {
        ++matchedPairs
        handleScoring(pointsOnCorrect)
        setTimeout(() => {
          firstCardNode.classList.add('matched')
          secondCardNode.classList.add('matched')
        }, 1000)
        if (matchedPairs === emojis.length / 2) {
          setTimeout(restartGame, 1000)
          handleHighScore()
        }
      } else {
        handleScoring(pointsOnWrong)
        setTimeout(() => {
          firstCardNode.classList.remove('revealed')
          firstCardNode.innerHTML = ''
          secondCardNode.classList.remove('revealed')
          secondCardNode.innerHTML = ''
        }, 1000)
      }
      firstCard = null
      secondCard = null
    }
  })
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleScoring(score) {
  totalScore += score
  document.getElementById('scorer').textContent = `Your Score: ${totalScore}`
}

function restartGame() {
  const restartBtn = document.createElement('button')
  restartBtn.textContent = 'play again'
  restartBtn.classList.add('restart-btn')
  restartBtn.addEventListener('click', () => location.reload())
  gameBoard.appendChild(restartBtn)
}

function handleHighScore() {
  const currentHS = localStorage.getItem('cmg_highestScore')
  if (currentHS != null) {
    if (totalScore > currentHS) {
      localStorage.setItem('cmg_highestScore', totalScore)
      highestScorer.innerHTML = `Highest Score: ${totalScore}`
    } else highestScorer.innerHTML = `Highest Score: ${currentHS}`
  } else {
    localStorage.setItem('cmg_highestScore', totalScore)
    highestScorer.innerHTML = `Highest Score: ${totalScore}`
  }
}