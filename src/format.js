
const {marked} = require('marked');
const renderer = new marked.Renderer();
const {
    ZhihumlToMarkdownMap,
    MarkdownToZhihumlMap,
    DoubaoToMarkdownMap
} = require('../resource/replaceMap');

function DoubaoToMarkdown(transText) {
    DoubaoToMarkdownMap.forEach(({ regularExpression, replacement }) => {transText = transText.replace(regularExpression, replacement)})
    return transText;
  }



function MarkdownToZhihuml(transText) {
    renderer.text = function (tokens) {
        MarkdownToZhihumlMap.forEach(({ regularExpression, replacement }) => {tokens.text = tokens.text.replace(regularExpression, replacement)})
        // console.log("0000"+tokens.text)
        return tokens.text;
    };

    renderer.paragraph = function (tokens) {
        return tokens.text;
    }

    marked.setOptions({
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
    });
    // MarkdownToZhihumlMap.forEach(({ regularExpression, replacement }) => {transText = transText.replace(regularExpression, replacement)})
    return marked(transText).replace(/\n/g,'')

    // return transText;
}

module.exports = {DoubaoToMarkdown, MarkdownToZhihuml};
