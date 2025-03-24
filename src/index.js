const fs = require('fs');
const path = require('path');
const {MarkdownToZhihuml} = require("./format");
const {sendEdition} = require("./send");

const {compare} = require("./compare");
const {utils} = require("./utils");
const commit = require("../resource/commit.json");
const config = require("../resource/config.json");
const history = require("../resource/history.json");

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
    fs.writeFileSync(path.join(process.cwd(), "resource", "commit.json"), JSON.stringify(commit, null, 4));
    deletedRows.forEach(row => row.sha256 ? sendEdition.deleteArticle(
        utils.findItemsFromJSON(commit, "sha256", row.sha256)[0].articleId
    ):(console.log("Missed id for delete article: " + row.Path)));

    const indexTitle = config.indexTitle?config.indexTitle:"index";
    const JSONToMarkdown = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.cache', history.updateEditionCacheList[0]), 'utf-8'));
    JSONToMarkdown.forEach(item => {item.articleId = utils.findItemsFromJSON(commit, "sha256", item.sha256)[0].articleId});
    const indexContent = utils.generateMDTableFromJSON(JSONToMarkdown, );
    console.log(MarkdownToZhihuml(indexContent));
    config.originDir?(sendEdition.updateArticle(config.originDir,indexTitle,MarkdownToZhihuml(indexContent))
        ).then(
            () => console.log(`Update index article with id ${config.originDir}`)):
        (sendEdition.createArticle(indexTitle,MarkdownToZhihuml(indexContent)).then(id => {
            config.originDir = id;
            console.log(`Create index article with id ${id}`);
            fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify(config, null, 4));
        }));
}

async function push() {
    await commitToZhihu(await compare.compareWithLastUpdate());
}


function init() {
    if (fs.existsSync(path.join(process.cwd(), ".cache"))) {
    fs.rmdirSync(path.join(process.cwd(), ".cache"), {recursive: true, force: true});
        fs.mkdirSync(path.join(process.cwd(), ".cache"))}
    else {
    fs.mkdirSync(path.join(process.cwd(), ".cache"));}
    fs.writeFileSync(path.join(process.cwd(), ".cache", "init.json"), JSON.stringify([], null, 4));
    fs.writeFileSync(path.join(process.cwd(), "resource", "history.json"), JSON.stringify({
        "updateEditionCacheList": [],
        "commitEditionCacheList": []
    }, null, 4));
    fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify({
        "workDir": ".",
        "indexTitle": "untitled",
        "headers": {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.5",
            "accept-encoding": "gzip, deflate, br, zstd",
            "referer": "https://zhuanlan.zhihu.com/write",
            "content-type": "application/json",
            "x-requested-with": "fetch",
            "origin": "https://zhuanlan.zhihu.com",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "priority": "u=4",
            "te": "trailers"
        },
        "cookies": {
            "z_c0": "2|1:0|10:1742816291|4:z_c0|92:Mi4xcEtMU05RQUFBQURnMTlQdkR2NGZHaVlBQUFCZ0FsVk5fNUhPYUFDdmR6UTgtRWJMWUpKTGhuczRUX3p1MjM1Vmd3|4e70a267afe738ea920dde8c63a3ba8d0e10278ae36f5b5cd8b631e6bccafc99"
        }
    }, null, 4))
    fs.writeFileSync(path.join(process.cwd(), "resource", "commit.json"), JSON.stringify([], null, 4))
}

function setCookie(cookie) {
    config.cookies.z_c0 = cookie;
    fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify(config, null, 4));
}

function setOriginDir(originDir) {
    config.originDir = originDir;
    fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify(config, null, 4));
}

function setIndexTitle(indexTitle) {
    config.indexTitle = indexTitle;
    fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify(config, null, 4));
}

function setWorkDir(workDir) {
    config.workDir = workDir;
    fs.writeFileSync(path.join(process.cwd(), "resource", "config.json"), JSON.stringify(config, null, 4));
}
exports.publisher = {
    init, push, setCookie, setOriginDir, setIndexTitle, setWorkDir
}