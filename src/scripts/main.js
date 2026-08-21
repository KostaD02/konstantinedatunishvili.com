function initMainJs() {
  initAOS();
  helloFromConsole();

  const navbar = document.querySelector(".kd-navbar");
  const burger = document.querySelector(".kd-burger");
  const skips = document.querySelectorAll("a.kd-skip");
  const scrollUp = document.querySelector("#scroll-up");

  let lastScrollPos = 0;

  burger.addEventListener("click", handleMenuClick);
  scrollUp.addEventListener("click", handleScrollUp);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);

  skips.forEach((skip) => {
    skip.addEventListener("keyup", handleSkip);
  });

  function handleSkip(event) {
    if (event.code === "Space" || event.code === "Enter") {
      setTimeout(() => {
        event.target.blur();
        if (event.code === "Space") {
          window.location.href = event.target.href;
        }
      }, 500);
    }
  }

  function handleScroll() {
    // ? iOS rubber-band overscroll reports a negative scrollTop, clamp it away
    const scrollPosition = Math.max(0, document.documentElement.scrollTop);

    if (scrollPosition === 0) {
      navbar.classList.remove("kd-navbar--hidden");
      navbar.classList.remove("kd-navbar--scrolled");
    } else if (scrollPosition > lastScrollPos) {
      navbar.classList.add("kd-navbar--hidden");
      navbar.classList.add("kd-navbar--scrolled");
    } else {
      navbar.classList.add("kd-navbar--scrolled");
      navbar.classList.remove("kd-navbar--hidden");
    }

    if (scrollPosition > 500) {
      scrollUp.classList.add("kd-active");
      scrollUp.classList.add("kd-animate-glow");
    } else {
      scrollUp.classList.remove("kd-active");
      scrollUp.classList.remove("kd-animate-glow");
    }

    lastScrollPos = scrollPosition;
  }

  function handleResize() {
    if (isMenuOpen() && window.innerWidth > 768) {
      handleMenuClick();
    }
  }

  function isMenuOpen() {
    return burger.getAttribute("aria-expanded") === "true";
  }

  function handleMenuClick() {
    if (!isMenuOpen()) {
      burger.setAttribute("aria-expanded", "true");
      scrollUp.classList.remove("kd-active");
      navbar.classList.add("kd-navbar--bare");

      const drawer = document.createElement("div");
      drawer.classList.add("kd-drawer");

      const panel = document.createElement("ul");
      panel.classList.add("kd-drawer__panel");
      panel.classList.add("kd-stagger");
      panel.innerHTML = navbar.querySelector(".kd-navbar__menu").innerHTML;
      drawer.appendChild(panel);

      drawer.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("kd-drawer") ||
          event.target.tagName === "A"
        ) {
          handleMenuClick();
        }
      });

      document.body.appendChild(drawer);
      document.body.style.overflow = "hidden";
      return;
    }

    burger.setAttribute("aria-expanded", "false");

    const drawer = document.querySelector(".kd-drawer");
    drawer.classList.add("kd-drawer--closing");

    setTimeout(() => {
      drawer.remove();
    }, 500);

    document.body.style.overflow = "auto";
    navbar.classList.remove("kd-navbar--bare");
  }

  function initAOS() {
    try {
      AOS.init({
        once: true,
      });
    } catch (err) {
      // ? If AOS is not loaded, remove the CSS file otherwise it will mess up positions
      document.querySelector("#aos-css").remove();
      console.log("Cannot init AOS, no animation on scroll :(");
    }
  }

  function handleScrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function helloFromConsole() {
    console.log(
      "%cWelcome to my portfolio",
      "color:#64ffda;font-size:28px;font-weight:bold"
    );
    console.log(
      "%cI hope you like it!",
      "color:#64ffda;font-size:20px;font-weight:bold"
    );
  }
}

window.addEventListener("DOMContentLoaded", initMainJs);
