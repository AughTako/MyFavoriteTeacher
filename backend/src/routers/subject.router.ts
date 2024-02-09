import express from 'express';
import { SubjectController } from '../controllers/subject.controller';

const SubjectRouter = express.Router();

SubjectRouter.route('/add').get(
    (req, res) => new SubjectController().addSubject(req, res)
);
SubjectRouter.route('/').get(
    (req, res) => new SubjectController().getAll(req, res)
);

export default SubjectRouter;