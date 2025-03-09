const eleventySass = require("eleventy-sass");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventySass);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/**/*.css");

  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("aFilter", function (array = [], filterBy = "") {
    return array.filter((item) => item[filterBy]);
  });

  eleventyConfig.addFilter(
    "aSlice",
    function (array = [], start = 0, end = array.length) {
      return array.slice(start, end);
    }
  );

  eleventyConfig.addFilter("capitalCase", function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  });

  eleventyConfig.addFilter("blogDate", function (data) {
    const date = new Date(data);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("tagNavigationList", function (data) {
    const tags = Object.keys(data);
    const postIndex = tags.indexOf("post");
    if (postIndex) {
      tags.splice(postIndex, 1);
    }
    return tags;
  });

  eleventyConfig.addFilter("isBlogPage", function (page) {
    return page.includes("blog") || page.includes("tags");
  });

  eleventyConfig.addFilter("parseUrlLastSegment", function (url) {
    return url.split("/").pop().split(".")[0] || "all";
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
