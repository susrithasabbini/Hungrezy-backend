import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../config/index.js';


cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const { uploader } = cloudinary;

const uploadImage = async (req) => {
    if (req.file) {
        try {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await uploader.upload(dataURI, { folder: 'Hungrezy_Images' });
            console.log('Image has been uploaded successfully to Cloudinary',result.secure_url);
            return {
                status: 200,
                message: 'Image has been uploaded successfully to Cloudinary',
                data: result
            };
        } catch (error) {
            console.log('Something went wrong while uploading image:', error);
            throw {
                status: 400,
                message: 'Something went wrong while uploading image',
                error: error
            };
        }
    }
};

export { uploadImage };
