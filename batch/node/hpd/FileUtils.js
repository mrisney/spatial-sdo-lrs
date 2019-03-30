var fs = require('fs');
var StreamZip = require('node-stream-zip');

class FileUtils {
    constructor() {}

    readZipfile(fileName) {
        return new Promise((resolve, reject) => {
            var filePath = __dirname + '/' + fileName;
            var zip = new StreamZip({
                file: filePath,
                storeEntries: true
            });

            zip.on('ready', () => {
                try {
                    const data = zip.entryDataSync('json.txt');
                    resolve(data.toString('utf8'));
                    zip.close();
                } catch (e) {
                    reject(Error(e.toString()));
                }
            });
        });
    }

    deleteFile(fileName) {

        var filePath = __dirname + '/' + fileName;
        fs.unlinkSync(filePath);
    }
}
module.exports = FileUtils;
