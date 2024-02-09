import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/finduser').post(
    (req, res) => new UserController().findUser(req, res)
);

userRouter.route('/changepassword').post(
    (req, res) => new UserController().changePassword(req, res)
);

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
);

userRouter.route('/get-students').get(
    (req, res) => new UserController().getStudents(req, res)
);

userRouter.route('/get-teachers').get(
    (req, res) => new UserController().getTeachers(req, res)
);

userRouter.route('/engaged-teachers').get(
    (req, res) => new UserController().getEngagedTeachersBySubject(req, res)
);

userRouter.route('/change-information').post(
    (req, res) => new UserController().changeInfo(req, res)
);

userRouter.route('/teachers').get(
    (req, res) => new UserController().getTeachersByGrade(req, res),
);

userRouter.route('/filter').get(
    (req, res) => new UserController().filterTeachers(req, res)
);

userRouter.route('/teacher').get(
    (req, res) => new UserController().getTeacher(req, res)
);

userRouter.route('/my-students').get(
    (req, res) => new UserController().getMyStudents(req, res)
);

userRouter.route('/my-students-classes').get(
    (req, res) => new UserController().getStudentClasses(req, res)
);

userRouter.route('/student').get(
    (req, res) => new UserController().getStudentInfo(req, res)
);

userRouter.route('/all-students').get(
    (req, res) => new UserController().getAllStudents(req, res)
);
userRouter.route('/all-teachers').get(
    (req, res) => new UserController().getAllTeachers(req, res)
);

export default userRouter;