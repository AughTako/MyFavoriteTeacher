import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Requests = new Schema({
    username: String,
    first_name: String,
    last_name: String,
    CV: String
})


const RequestsModel = mongoose.model('RequestsModel', Requests, 'requests');

export default RequestsModel;