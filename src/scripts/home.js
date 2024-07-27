const updateWordRef = document.querySelector("#update-word");
const experienceJobRef = document.querySelector("#job_description");
const experiencesRefs = document.querySelectorAll("div[data-experience]");
const experienceButtonRefs = document.querySelectorAll(
  "button[data-experience-index]"
);

const wordsToUpdate = ["create", "maintain", "develop"];
const experiences = [];

const animationMs = 5000;

const interval = setInterval(updateWord, animationMs);

experiencesRefs.forEach((experienceRef, index) => {
  const experience = {};

  for (const child of experienceRef.children) {
    const name = child.getAttribute("data-name");
    child.textContent = child.textContent.trim();

    if (name === "descriptions") {
      if (!experience[name]) {
        experience.descriptions = [];
      }

      experience.descriptions.push(child.textContent);
      continue;
    }

    experience[name] = child.textContent || null;
  }

  experiences.push(experience);

  if (index + 1 === experiencesRefs.length) {
    initExperienceSwipe();
  }
});

function updateWord() {
  if (!updateWordRef) {
    clearInterval(interval);
    return;
  }

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

function initExperienceSwipe() {
  experienceButtonRefs.forEach((button, index, self) => {
    button.addEventListener("click", function () {
      const experience = experiences.find(
        (experience) => experience.name === this.textContent.trim()
      );
      const h3 = experienceJobRef.querySelector("h3");
      const p = experienceJobRef.querySelector("p");
      const ul = experienceJobRef.querySelector("ul");
      h3.textContent = experience.position;
      if (experience.url) {
        h3.innerHTML += `
           <span>
              <a
                class="external"
                target="_blank"
                href="${experience.url}"
              >
                ${experience.name}
              </a
              >
            </span>
        `;
      }
      p.innerHTML = `${experience.startDate} - ${experience.endDate}`;
      ul.innerHTML = "";
      experience.descriptions.forEach((description) => {
        ul.innerHTML += `<li><span>${description}</span></li>`;
      });
      self.forEach((button) => {
        button.classList.remove("active");
      });
      this.classList.add("active");
    });
    if (index === 0) {
      button.click();
      button.classList.add("active");
    }
  });
}
