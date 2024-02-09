import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ClassRequests = new Schema({
    username: String,
    personalInfo: {
        username: String,
        first_name: String,
        last_name: String,
    },
    classInfo: {
        class: String,
        topic: String,
        dateStart: Date,
        dateEnd: Date
    },
    status: Boolean
})


const ClassRequestsModel = mongoose.model('ClassRequestsModel', ClassRequests, 'requests_classes');

export default ClassRequestsModel;