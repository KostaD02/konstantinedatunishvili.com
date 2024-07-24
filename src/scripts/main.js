(function () {
  function init() {
    if (isLocalDevelopment()) {
      appendLocalStyles();
      console.log();
    }
  }

  function isLocalDevelopment() {
    return window.location.hostname === "localhost";
  }

  function appendLocalStyles() {
    const styles = [
      "../../src/styles/typography.css",
      "../../src/styles/style.css",
    ];
    styles.forEach((href) => {
      const style = document.createElement("style");
      style.setAttribute("rel", "stylesheet");
      style.setAttribute("href", href);
      document.head.appendChild(style);
    });
  }

  init();
})();
