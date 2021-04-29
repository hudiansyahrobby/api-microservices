import multer from 'multer';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file: any, cb: Function) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Please upload only images.', false);
    }
};
const maxFileSize = 1 * 1000 * 1000; // 1 mb

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: maxFileSize },
});

const maxFileTotal = 5;

const uploadFiles = upload.array('images', maxFileTotal);

export default uploadFiles;
