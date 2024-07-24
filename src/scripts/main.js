function init() {
  const header = document.querySelector("header");
  const menu = document.querySelector("button.menu");

  let lastScrollPos = 0;

  function handleScroll() {
    const scrollPosition = document.documentElement.scrollTop;

    if (scrollPosition > lastScrollPos) {
      header.classList.add("hide");
      header.classList.add("scrolled");
    } else if (scrollPosition === 0) {
      header.classList.remove("hide");
      header.classList.remove("scrolled");
    } else {
      header.classList.add("scrolled");
      header.classList.remove("hide");
    }

    lastScrollPos = scrollPosition;
  }

  function handleResize() {
    const isOpen = document.querySelector(".open");
    if (isOpen && window.innerWidth > 768) {
      isOpen.click();
    }
  }

  function handleMenuClick() {
    this.classList.toggle("open");
    const isOpen = this.classList.contains("open");
    const parent = this;

    if (isOpen) {
      header.classList.add("hide-colors");
      const modal = document.createElement("div");
      modal.classList.add("navigation-modal");
      const ul = document.createElement("ul");
      ul.innerHTML = header.querySelector("ul").innerHTML;
      modal.appendChild(ul);
      modal.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("navigation-modal") ||
          event.target.tagName === "A"
        ) {
          parent.click();
        }
      });
      header.appendChild(modal);
      document.body.style.overflow = "hidden";
      return;
    }

    const navigationModal = document.querySelector(".navigation-modal");
    navigationModal.classList.add("fade-out");
    navigationModal.querySelector("ul").classList.add("slide-out");

    setTimeout(() => {
      navigationModal.remove();
    }, 500);

    document.body.style.overflow = "auto";
    header.classList.remove("hide-colors");
  }

  menu.addEventListener("click", handleMenuClick);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
}

window.addEventListener("DOMContentLoaded", init);
