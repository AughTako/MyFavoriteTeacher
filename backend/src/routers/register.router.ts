import express from 'express';
import { RegisterController } from '../controllers/register.controller';

const registerRouter = express.Router();

registerRouter.route('/').post(
    (req, res) => new RegisterController().register(req, res)
);

export default registerRouter;