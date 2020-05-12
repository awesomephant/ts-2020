const pluginSass = require("eleventy-plugin-sass");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./js");
    eleventyConfig.addPassthroughCopy("./*.xml");
    eleventyConfig.addPassthroughCopy("./favicon.ico");
    eleventyConfig.addWatchTarget("./scss/");
    eleventyConfig.addPlugin(pluginSass, {watch: './scss/*.scss'});
};