const fs = require('fs');
const path = require('path');
const history = require('../resource/history.json');
const {workDir} = require('../resource/config.json');
const {utils} = require('./utils');

async function updateEdition(dir) {
    const files = await utils.readDirectory(dir);
    const records = [];

    for (const file of files) {
        try {
            const sha256 = await utils.calculateSHA256(file);
            const stats = await fs.promises.stat(file);
            const lastModified = stats.mtime.toISOString();
            records.push({
                path: file,
                sha256: sha256,
                lastModified: lastModified
            });
        } catch (error) {
            console.error(`Error processing file ${file}:`, error);
        }
    }

    fs.writeFileSync( process.cwd()+'\\.cache\\0.json',JSON.stringify(records, null, 2),);
    const records_sha256 = await utils.calculateSHA256(process.cwd()+'\\.cache\\0.json');
    fs.renameSync(process.cwd()+'\\.cache\\0.json', process.cwd()+'\\.cache\\' + records_sha256.slice(0,6) + '.json');

    history.updateEditionCacheList=[records_sha256.slice(0,6) + '.json',...history.updateEditionCacheList]
    fs.writeFileSync(process.cwd()+'\\resource\\history.json', JSON.stringify(history, null, 2));
    console.log(`Update to edition ${records_sha256.slice(0,6)}`);
}

function compareEdition(oldFile, newFile) {
    const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf-8'));
    const newData = JSON.parse(fs.readFileSync(newFile, 'utf-8'));

    const oldSha256Map = new Map();
    const newSha256Map = new Map();

    oldData.forEach(row => {
        if (row.sha256) {
            oldSha256Map.set(row.sha256, row);
        }
    });
    newData.forEach(row => {
        if (row.sha256) {
            newSha256Map.set(row.sha256, row);
        }
    });

    const createdRows = [];
    newSha256Map.forEach((row, sha256) => {
        if (!oldSha256Map.has(sha256)) {
            createdRows.push(row);
        }
    });

    const deletedRows = [];
    oldSha256Map.forEach((row, sha256) => {
        if (!newSha256Map.has(sha256)) {
            deletedRows.push(row);
        }
    });
    return {createdRows, deletedRows};
}

async function compareWithLastUpdate() {
    await updateEdition(workDir)

    const oldFilePath = path.join(process.cwd(), '.cache', history.updateEditionCacheList[1]?history.updateEditionCacheList[1]:'init.json');
    const newFilePath = path.join(process.cwd(), '.cache', history.updateEditionCacheList[0]);

    return compareEdition(oldFilePath, newFilePath);
}


exports.compare = {
    compareWithLastUpdate
}
