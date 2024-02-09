import express from 'express';
import SubjectModel from '../models/subject.model';
export class SubjectController {
    getAll = (req: express.Request, res: express.Response) => {
        SubjectModel.find()
        .then((subjects)=> {
            res.json(subjects);
        })
    }

    addSubject = (req: express.Request, res: express.Response) => {
        const {subject} = req.query
        SubjectModel.create({name: subject})
        .then((ok) => {
            console.log('New subject: ', ok);
        })
        .catch((err) => {
            console.log(err);
        })
    }
}