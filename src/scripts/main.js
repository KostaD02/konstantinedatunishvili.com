function initMainJs() {
  initAOS();
  helloFromConsole();

  const navbar = document.querySelector(".kd-navbar");
  const burger = document.querySelector(".kd-burger");
  const skips = document.querySelectorAll("a.kd-skip");
  const scrollUp = document.querySelector("#scroll-up");

  let lastScrollPos = null;
  let anchorScrollTimer = null;
  let isAnchorScroll = false;

  burger.addEventListener("click", handleMenuClick);
  scrollUp.addEventListener("click", handleScrollUp);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);

  skips.forEach((skip) => {
    skip.addEventListener("keyup", handleSkip);
  });

  document.addEventListener("click", handleAnchorClick);
  window.addEventListener("hashchange", holdAnchorScroll);

  if (window.location.hash) {
    holdAnchorScroll();
  }

  // ? Sync with the position the page actually loaded at, restored or not
  handleScroll();

  function handleAnchorClick(event) {
    const link = event.target.closest && event.target.closest("a");

    // ? Jumping to an anchor scrolls the page for the user, that is not them scrolling
    if (link && /^(\/)?#/.test(link.getAttribute("href") || "")) {
      holdAnchorScroll();
    }
  }

  function holdAnchorScroll() {
    isAnchorScroll = true;
    clearTimeout(anchorScrollTimer);
    anchorScrollTimer = setTimeout(() => {
      isAnchorScroll = false;
    }, 200);
  }

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
    // ? The first event can be the browser restoring scroll, never read that as scrolling down
    const isFirstEvent = lastScrollPos === null;

    // ? Keep holding while the smooth scroll is still running
    if (isAnchorScroll) {
      holdAnchorScroll();
    }

    if (scrollPosition === 0) {
      navbar.classList.remove("kd-navbar--hidden");
      navbar.classList.remove("kd-navbar--scrolled");
    } else if (!isFirstEvent && !isAnchorScroll && scrollPosition > lastScrollPos) {
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

  function hasOpenedDrawer() {
    try {
      const opened = sessionStorage.getItem("kd-drawer-intro");
      sessionStorage.setItem("kd-drawer-intro", "1");
      return Boolean(opened);
    } catch (error) {
      return false;
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

      if (hasOpenedDrawer()) {
        panel.classList.remove("kd-stagger");
        panel
          .querySelectorAll(".kd-animate-drop-in")
          .forEach((item) => item.classList.remove("kd-animate-drop-in"));
      }

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
