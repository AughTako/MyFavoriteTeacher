import express from 'express';
import { ImageController } from '../controllers/image.controller';

const imageRouter = express.Router()

imageRouter.route('/upload').post(
    (req, res) => new ImageController().upload(req, res)
);

imageRouter.route('/:filename').get(
    (req, res) => new ImageController().serveImg(req, res)
);

export default imageRouter;