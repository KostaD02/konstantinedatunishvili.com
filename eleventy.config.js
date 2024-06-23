module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addPassthroughCopy("src/**/*.css");
  eleventyConfig.addPassthroughCopy("src/**/*.css.map");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.setBrowserSyncConfig({
    files: "./public/styles/**/*.css",
  });

  return {
    dir: {
      input: "src",
      output: "public",
      layouts: "layouts/page",
      includes: "layouts/partials",
    },
  };
};
