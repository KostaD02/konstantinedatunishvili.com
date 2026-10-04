function initHomeJs() {
  initWordCycle();
  initExperienceTabs();

  function initWordCycle() {
    const wordRef = document.querySelector("#update-word");

    // ? Respect the user's motion preference, the cycle is decoration only
    if (!wordRef || prefersReducedMotion()) {
      return;
    }

    const words = ["create", "maintain", "develop"];
    const holdMs = 5000;
    const stepMs = 250;

    reserveWidth();
    window.addEventListener("resize", reserveWidth);

    if (document.fonts) {
      document.fonts.ready.then(reserveWidth);
    }

    // ? The first word is already rendered, so the cycle starts by erasing it
    setTimeout(erase, holdMs);

    function erase() {
      const text = wordRef.textContent;

      if (text.length > 0) {
        wordRef.textContent = text.slice(0, -1);
        setTimeout(erase, stepMs);
        return;
      }

      type(nextWord(), 0);
    }

    function type(word, index) {
      if (index < word.length) {
        wordRef.textContent = word.slice(0, index + 1);
        setTimeout(() => type(word, index + 1), stepMs);
        return;
      }

      setTimeout(erase, holdMs);
    }

    // ? Typing must never move the text after the word, so the box always fits the longest one
    function reserveWidth() {
      const probe = document.createElement("span");

      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      wordRef.appendChild(probe);

      const width = Math.max(
        ...words.map((word) => {
          probe.textContent = word;
          return probe.getBoundingClientRect().width;
        })
      );

      probe.remove();
      wordRef.style.display = "inline-block";
      wordRef.style.minWidth = `${Math.ceil(width)}px`;
    }

    function nextWord() {
      const previous = wordRef.dataset.word || words[0];
      const candidates = words.filter((word) => word !== previous);
      const word = candidates[Math.floor(Math.random() * candidates.length)];

      wordRef.dataset.word = word;
      return word;
    }
  }

  function initExperienceTabs() {
    const dataRef = document.querySelector("#experiences-data");
    const panel = document.querySelector("#job_description");
    const tabs = Array.from(
      document.querySelectorAll("button[data-experience-index]")
    );

    if (!dataRef || !panel || !tabs.length) {
      return;
    }

    const experiences = JSON.parse(dataRef.textContent);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", handleTabKeydown);
    });

    function handleTabKeydown(event) {
      const keys = {
        ArrowDown: 1,
        ArrowRight: 1,
        ArrowUp: -1,
        ArrowLeft: -1,
      };

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        selectTab(event.key === "Home" ? tabs[0] : tabs[tabs.length - 1], true);
        return;
      }

      const step = keys[event.key];

      if (!step) {
        return;
      }

      event.preventDefault();
      const next = (tabs.indexOf(event.currentTarget) + step + tabs.length) % tabs.length;
      selectTab(tabs[next], true);
    }

    function selectTab(tab, focus = false) {
      const experience = experiences[Number(tab.dataset.experienceIndex)];

      if (!experience) {
        return;
      }

      tabs.forEach((item) => {
        const isCurrent = item === tab;
        item.classList.toggle("kd-active", isCurrent);
        item.setAttribute("aria-selected", String(isCurrent));
        item.setAttribute("tabindex", isCurrent ? "0" : "-1");
      });

      panel.setAttribute("aria-labelledby", tab.id);
      renderExperience(experience);

      if (focus) {
        tab.focus();
      }
    }

    function renderExperience(experience) {
      const heading = panel.querySelector("h3");
      const dates = panel.querySelector("p");
      const list = panel.querySelector("ul");

      heading.textContent = experience.position;

      if (experience.url) {
        const wrapper = document.createElement("span");
        wrapper.className = "kd-text-accent";
        wrapper.append("@");

        const link = document.createElement("a");
        link.className = "kd-link";
        link.target = "_blank";
        link.rel = "noopener";
        link.href = experience.url;
        link.textContent = experience.name;

        wrapper.appendChild(link);
        heading.append(" ", wrapper);
      }

      dates.textContent = `${experience.startDate} - ${experience.endDate}`;

      list.replaceChildren(
        ...experience.descriptions.map((description) => {
          const item = document.createElement("li");
          const span = document.createElement("span");
          span.textContent = description;
          item.appendChild(span);
          return item;
        })
      );
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

window.addEventListener("DOMContentLoaded", initHomeJs);
