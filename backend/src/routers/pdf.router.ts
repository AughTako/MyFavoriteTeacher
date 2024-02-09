import express from 'express';
import { PdfController } from '../controllers/pdf.controller';

const pdfRouter = express.Router()

pdfRouter.route('/upload').post(
    (req, res) => new PdfController().upload(req, res)
);

pdfRouter.route('/:filename').get(
    (req, res) => new PdfController().servePdf(req, res)
);

export default pdfRouter;