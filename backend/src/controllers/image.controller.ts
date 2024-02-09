import express from 'express';
import multer from 'multer';
import path from 'path';

const uploadDir: string = path.join(__dirname, '../../uploads');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(uploadDir, 'images')); // Set the destination folder for image files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const imageUpload = multer({ storage: imageStorage }).single('image');

export class ImageController {
    upload = (req: express.Request, res: express.Response) => {
        imageUpload(req, res, (uploadErr: any) => {
            if (uploadErr) {
                console.error('Error uploading image:', uploadErr);
                return res.status(500).json({ success: false, message: 'Error uploading image', error: uploadErr.message });
            }

            // Check if req.file is defined before using it
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image file provided' });
            }

            // If upload is successful, you can access the uploaded image file details via req.file
            const imageName = req.file.filename;
            const imagePath = path.join('uploads/images/', imageName);

            console.log(imagePath)

            // Process or store the image details as needed

            res.status(200).json({ success: true, message: 'Image uploaded successfully', imagePath, imageName });
        });
    };

    serveImg = (req: express.Request, res: express.Response) => {
        const filename = req.params.filename;
        const imgPath = path.join(__dirname, '../../uploads/images', filename);
        res.sendFile(imgPath);
    };

    changeImg = (req: express.Request, res: express.Response) => {

    };
}
