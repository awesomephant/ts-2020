const pluginSass = require("eleventy-plugin-sass");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
    
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }

        return content;
    });

    eleventyConfig.addPassthroughCopy("./js");
    eleventyConfig.addPassthroughCopy("./*.xml");
    eleventyConfig.addPassthroughCopy("./favicon.ico");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addWatchTarget("./scss/");
    eleventyConfig.addPlugin(pluginSass, { watch: './scss/*.scss' });
};