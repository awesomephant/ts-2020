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
                `
                <figure data-original='${url}' data-large="${awsUrl + large}" class='work-figure'>
                    <img loading="lazy" src='${awsUrl + large}'/>
                    <button class='figure-expand'><svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
                </svg></button>
                </figure>
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