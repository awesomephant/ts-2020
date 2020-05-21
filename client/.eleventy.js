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

    eleventyConfig.addShortcode("fig", function (url) {
        const thumb = url.replace(/\.(jpe?g|png)/gi, '%40100w.webp').trim().replace(' ', '+')
        const large = url.replace(/\.(jpe?g|png)/gi, '%401500w.webp').trim().replace(' ', '+')
        const awsUrl = `https://ts-2020.s3.eu-west-2.amazonaws.com/`
        if (url.length > 1) {
            return (
                `<img data-original='${url}' data-large="${awsUrl + large}" loading="lazy" src='${awsUrl + thumb}'/>
                `
            );
        }
    });

    eleventyConfig.addShortcode("brackets", function (bracket, count) {
        let output = ''
        for (let i = 0; i < count; i++) {
            output += bracket
        }

        return `<span class="bracket">${output}</span>`
    });

    eleventyConfig.addPairedShortcode("link", function (content, url) {
        return `<span class="externalLink-wrapper">${content}<a href='${url}' class='externalLink'>↗</a></span>`
    });

    eleventyConfig.addPassthroughCopy("./js");
    eleventyConfig.addPassthroughCopy("./*.xml");
    eleventyConfig.addPassthroughCopy("./favicon.ico");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addWatchTarget("./scss/");
    eleventyConfig.addPlugin(pluginSass, { watch: './scss/*.scss' });
};