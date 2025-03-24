const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function calculateSHA256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (error) => reject(error));
    });
}

// 读取目录下的所有文件
async function readDirectory(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await readDirectory(entryPath);
            files.push(...subFiles);
        } else {
            files.push(entryPath);
        }
    }
    return files;
}

function findItemsFromJSON(JsonFile, findKey,findValue) {
    return JsonFile.filter((item) => item[findKey] === findValue);
}

function changeKeysFromJSON(JsonFile, changes) {
    JsonFile.forEach((item) => {
        for (const change in changes) {
            if (item[changes[change].queryKey]===changes[change].queryValue) {
                item[changes[change].changeKey] = changes[change].changeValue;
            }}}
    )
    fs.writeFileSync(JsonFile, JSON.stringify(JsonFile, null, 2));
}
function generateMDTableFromJSON(JSONInput) {
    return JSONInput.map(item => '['+item.path +'](https://zhuanlan.zhihu.com/p/'+item.articleId+'/edit) \n\n').join('');
}
exports.utils = {
    calculateSHA256,
    readDirectory,
    changeKeysFromJSON,
    findItemsFromJSON,
    generateMDTableFromJSON
}

