import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import AdminModel from './models/admin.model';
import AdminRouter from './routers/admin.router';
import classRouter from './routers/class.router';
import imageRouter from './routers/image.router';
import pdfRouter from './routers/pdf.router';
import registerRouter from './routers/register.router';
import SubjectRouter from './routers/subject.router';
import userRouter from './routers/user.router';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/project2024');
const connection = mongoose.connection;

connection.once('open', async () => {
    try {
        const existingAdmin = await AdminModel.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const adminData = {
                username: 'admin',
                password: 'admin'
            };

            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            adminData.password = hashedPassword;

            await AdminModel.create(adminData);
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists. No action needed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

const storage = multer.memoryStorage(); // Store files in memory for now
const upload = multer({ storage: storage });

const router = express.Router();

app.use('/', router);
router.use('/register', registerRouter);
router.use('/admin', AdminRouter);
router.use('/image', imageRouter);
router.use('/pdf', pdfRouter);
router.use('/users', userRouter);
router.use('/class', classRouter);
router.use('/subjects', SubjectRouter)

app.use('/register', upload.single('avatar'), registerRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(4000, () => console.log(`Express server running on port 4000`));
