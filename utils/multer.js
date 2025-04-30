import multer from 'multer';

const storage = multer.memoryStorage(); 

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
            cb(new Error('Only image files are allowed!'), false);
        } else {
            cb(null, true);
        }
    },
});