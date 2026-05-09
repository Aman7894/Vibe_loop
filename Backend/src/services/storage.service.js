const ImageKit=require("@imagekit/nodejs");
require('dotenv').config();

const publicKey=process.env.publicKey;
const privateKey=process.env.privateKey;
const urlEndpoint=process.env.urlEndpoint;

const imagekit=new ImageKit({
    publicKey:publicKey,
    privateKey:privateKey,
    urlEndpoint:urlEndpoint
})
const fs = require('fs');

async function uploadFile(fileInput, filename = "upload_media.mp4") {
    if (!fileInput) throw new Error("File input (path or buffer) is required for upload.");
    
    // Safely determine which upload method to use based on the SDK version
    let uploadMethod = null;
    if (typeof imagekit.upload === 'function') {
        uploadMethod = imagekit.upload.bind(imagekit);
    } else if (imagekit.files && typeof imagekit.files.upload === 'function') {
        uploadMethod = imagekit.files.upload.bind(imagekit.files);
    }
    
    if (!uploadMethod) {
        throw new Error("Could not find a valid upload method on the ImageKit instance.");
    }

    // If fileInput is a string, it's a file path. ImageKit SDK handles streams internally when a path is provided.
    // Otherwise, it treats it as a buffer or base64 string.
    const fileSource = typeof fileInput === 'string' ? fs.createReadStream(fileInput) : fileInput;

    const result = await uploadMethod({
        file: fileSource, 
        fileName: filename,
        folder: "/vibe_loop/media"
    });
    
    return result;
}

module.exports = uploadFile;