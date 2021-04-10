const fs = require('fs');

exports.deleteImages = (files: Array<string>) => {
    for (const file of files) {
        const path = `public/${file}`;
        fs.unlinkSync(path);
    }
};
