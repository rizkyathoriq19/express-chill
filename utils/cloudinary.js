import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './env.js';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET,
});

export const uploadImageFromBuffer = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        {
            folder,
            resource_type: 'image',
        },
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }
        );

        Readable.from(buffer).pipe(stream);
    });
};

export const deleteImage = (publicId) => { 
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

export const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = parts.slice(versionIndex + 1); 
    const filename = publicIdParts.join('/').split('.')[0]; 
    return filename;
};
