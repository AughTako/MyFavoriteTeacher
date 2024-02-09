import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    securityQuestion: {
        question: String,
        answer: String,
    },
    personalInfo: {
        first_name: String,
        last_name: String,
        gender: String,
        address: String,
        phone: String,
        email: {
            type: String,
            unique: true,
            required: true,
        },
        avatar: String,
    },
    schoolInfo: {
        school_type: String,
        currentGrade: Number,
        subjects: {
            type: [String],
            default: [],
        },
        ageGroups: {
            type: [String],
            default: [],
        },
        sourceOfInformation: String,
    },
    workInfo: {
        start_hour: String,
        end_hour: String,
    },
    CV: String,
    active: Boolean
});

const UserModel = mongoose.model('UserModel', userSchema, 'users');

export default UserModel;
