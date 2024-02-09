import express from 'express';
import { ClassController } from '../controllers/class.controller';

const classRouter = express.Router()

classRouter.route('/send-request').post(
    (req, res) => new ClassController().sendRequest(req, res)
);

classRouter.route('/').get(
    (req, res) => new ClassController().getRequests(req, res)
);

classRouter.route('/accept').get(
    (req, res) => new ClassController().acceptClass(req, res)
);

classRouter.route('/accepted').get(
    (req, res) => new ClassController().getAccepted(req, res)
);

classRouter.route('/get-all').get(
    (req, res) => new ClassController().getAllClasses(req, res)
)

export default classRouter;