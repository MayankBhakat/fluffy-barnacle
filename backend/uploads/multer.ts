import { Request } from 'express';
import multer, { diskStorage, FileFilterCallback } from 'multer';

const storage = diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, './uploads');
    },
    filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter
});

export default upload;
