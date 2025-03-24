const fs = require('fs');
const path = require('path');
const {MarkdownToZhihuml} = require("../note/src/trans/format");
const {sendEdition} = require("./send");

const {compare} = require("./compare");
const {utils} = require("./utils");
const commit = require("./resource/commit.json");
const config = require("./resource/config.json");
const history = require("./resource/history.json");

async function commitToZhihu(comparedResult) {
    const {createdRows, deletedRows} = comparedResult;
    for (let row of createdRows) {
        await sendEdition.createArticle(row.path, MarkdownToZhihuml(fs.readFileSync(row.path, 'utf-8'))).then(
            id => commit.push({
                "sha256": row.sha256,
                "articleId": id
            })
        )
    }
    fs.writeFileSync(path.join(__dirname, "resource", "commit.json"), JSON.stringify(commit, null, 4));
    deletedRows.forEach(row => row.sha256 ? sendEdition.deleteArticle(
        utils.findItemsFromJSON(commit, "sha256", row.sha256)[0].articleId
    ):(console.log("Missed id for delete article: " + row.Path)));

    const indexTitle = config.indexTitle?config.indexTitle:"index";
    const JSONToMarkdown = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', history.updateEditionCacheList[0]), 'utf-8'));
    JSONToMarkdown.forEach(item => {item.articleId = utils.findItemsFromJSON(commit, "sha256", item.sha256)[0].articleId});
    const indexContent = utils.generateMDTableFromJSON(JSONToMarkdown, );
    console.log(MarkdownToZhihuml(indexContent));
    config.originDir?(sendEdition.updateArticle(config.originDir,indexTitle,MarkdownToZhihuml(indexContent))
        ).then(
            () => console.log(`Update index article with id ${config.originDir}`)):
        (sendEdition.createArticle(indexTitle,MarkdownToZhihuml(indexContent)).then(id => {
            config.originDir = id;
            console.log(`Create index article with id ${id}`);
            fs.writeFileSync(path.join(__dirname, "resource", "config.json"), JSON.stringify(config, null, 4));
        }));
}

async function push() {
    await commitToZhihu(await compare.compareWithLastUpdate());
}


async function init() {
    fs.rmdirSync(path.join(__dirname, ".cache"), {recursive: true, force: true})
    fs.mkdirSync(path.join(__dirname, ".cache"));
    fs.writeFileSync(path.join(__dirname, ".cache", "init.json"), JSON.stringify([], null, 4));
    fs.writeFileSync(path.join(__dirname, "resource", "history.json"), JSON.stringify({
        "updateEditionCacheList": [],
        "commitEditionCacheList": []
    }, null, 4));
    fs.writeFileSync(path.join(__dirname, "resource", "commit.json"), JSON.stringify([], null, 4))
}

exports.init = init;
exports.push = push;