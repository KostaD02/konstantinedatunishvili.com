const updateWordRef = document.querySelector("#update-word");
const wordsToUpdate = ["create", "maintain", "develop"];

const animationMs = 5000;

setInterval(updateWord, animationMs);

function updateWord() {
  const previousWord = updateWordRef.textContent;
  let newWord = wordsToUpdate[Math.floor(Math.random() * wordsToUpdate.length)];

  while (previousWord === newWord) {
    newWord = wordsToUpdate[Math.floor(Math.random() * wordsToUpdate.length)];
  }

  animateWord(newWord, 0);
}

function animateWord(newWord, index) {
  if (index < newWord.length) {
    updateWordRef.textContent = newWord.substring(0, index + 1);
    setTimeout(() => {
      animateWord(newWord, index + 1);
    }, 250);
  }
}
