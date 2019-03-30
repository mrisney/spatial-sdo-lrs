const FTPClient = require("./FTPClient.js");
const FileUtils = require("./FileUtils.js");
const Formatting = require("./Formatting.js");

var client = new FTPClient();
var fileUtils = new FileUtils();

async function downloadFile() {

    // 1. get  the name of lastest mvar zip file.
    const latestFile = await client.getLatestMVARFile();

    // 2. download it.
    await client.downloadFile(latestFile);

    // 3. read the zip file, get the json from json.txt.
    const JSON = await fileUtils.readZipfile(latestFile);

    // 4. delete the locally downloaded file
    await fileUtils.deleteFile(latestFile);

    return JSON;
}

downloadFile().then((JSON) => {
    var formatUtils = new Formatting(JSON);
    formatUtils.jsonToSQL().forEach(function (sql) {
        console.log(sql);
    });
});
