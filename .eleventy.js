const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = markdownIt({ html: true });

  eleventyConfig.addFilter("md", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/Qaid-Jacobs-UX-and-Product-Designer.pdf");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    marksFrontMatterAsGlobal: true,
  };
};
