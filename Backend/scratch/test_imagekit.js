const ImageKit = require("@imagekit/nodejs");
require('dotenv').config();

const publicKey = process.env.publicKey;
const privateKey = process.env.privateKey;
const urlEndpoint = process.env.urlEndpoint;

console.log("Checking ImageKit initialization...");
try {
    const imagekit = new ImageKit({
        publicKey: publicKey,
        privateKey: privateKey,
        urlEndpoint: urlEndpoint
    });

    console.log("ImageKit Instance:", typeof imagekit);
    console.log("imagekit.upload:", typeof imagekit.upload);
    if (imagekit.files) {
        console.log("imagekit.files.upload:", typeof imagekit.files.upload);
    } else {
        console.log("imagekit.files is undefined");
    }
} catch (err) {
    console.error("Initialization Error:", err.message);
}
