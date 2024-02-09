import express from 'express';
import multer from 'multer';
import path from 'path';

const uploadDir: string = path.join(__dirname, '../../uploads');

const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(uploadDir, 'pdfs')); // Set the destination folder for PDF files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const pdfUpload = multer({ storage: pdfStorage }).single('pdf'); // Assuming your form field for PDF is named 'pdf'

export class PdfController {
    upload = (req: express.Request, res: express.Response) => {
        pdfUpload(req, res, (uploadErr: any) => {
            if (uploadErr) {
                console.error('Error uploading PDF:', uploadErr);
                return res.status(500).json({ success: false, message: 'Error uploading PDF', error: uploadErr.message });
            }

            // Check if req.file is defined before using it
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No PDF file provided' });
            }

            // If upload is successful, you can access the uploaded PDF file details via req.file
            const pdfName = req.file.filename;
            const pdfPath = path.join('uploads/pdfs', pdfName);
            console.log(pdfPath)
            // Process or store the PDF details as needed

            res.status(200).json({ success: true, message: 'PDF uploaded successfully', pdfPath, pdfName });
        });
    };

    servePdf = (req: express.Request, res: express.Response) => {
        const filename = req.params.filename;
        const pdfPath = path.join(__dirname, '../../uploads/pdfs', filename);
        res.sendFile(pdfPath);
    };
}
