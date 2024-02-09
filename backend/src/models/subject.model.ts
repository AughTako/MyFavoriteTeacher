import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Subject = new Schema({
    name: String,
})


const SubjectModel = mongoose.model('SubjectModel', Subject, 'subjects');

export default SubjectModel;