const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (file: any) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err: any, res: any) => {
            if (err) return res.status(400).json({ message: err });
            resolve(res.secure_url);
        });
    });
};

export const deleteImageOnCloudinary = (cloudinary_id: string) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(cloudinary_id, (err: any, res: any) => {
            if (err) return res.status(400).json({ message: err });
            resolve(res);
        });
    });
};
