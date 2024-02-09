import bcrypt from 'bcrypt';
import express from 'express';
import ClassRequestsModel from '../models/requests_class.model';
import UserModel from '../models/user.model';

export class UserController {
    getAllStudents = async (req: express.Request, res: express.Response) => {
        await UserModel.find({type: 'Ucenik'})
        .then((students) => {
            console.log(students);
            res.json(students);
        })
        .catch((err)=> {
            console.log(err);
        })
    }
    getAllTeachers = async (req: express.Request, res: express.Response) => {
        await UserModel.find({type: 'Nastavnik'})
        .then((teachers) => {
            console.log(teachers);
            res.json(teachers);
        })
        .catch((err)=> {
            console.log(err);
        })
    }

    findUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        UserModel.findOne({ username: username })
            .then((user) => {
                if (user) {
                    let seq_question = user?.securityQuestion?.question;
                    let seq_answer = user?.securityQuestion?.answer;
                    res.json({
                        seq_question: seq_question,
                        seq_answer: seq_answer,
                        message: 'Pronadjen korisnik'
                    })
                }
                else {
                    res.json({ message: 'Nije pronadjen' });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    changePassword = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let new_password = req.body.new_password;
        let old_password = req.body.old_password;
        let flag = req.body.flag;
        console.log(req.body);
        if (!flag) {
            UserModel.findOne({ username: username })
                .then(async (user) => {
                    if (user) {
                        const hashedPassword = user.password;
                        const passwordMatch = await bcrypt.compare(old_password, hashedPassword);
                        if (passwordMatch) {
                            const new_hashedPassword = await bcrypt.hash(new_password, 10);
                            UserModel.updateOne({ username: username }, { password: new_hashedPassword })
                                .then((ok) => {
                                    res.json({ message: 'Uspesno promenjena lozinka' });
                                })
                        }
                        else {
                            res.json({ message: 'Stara lozinka nije tacna' })
                        }
                    }
                })
        }
        else {
            UserModel.findOne({ username: username })
                .then(async (user) => {
                    if (user) {
                        const new_hashedPassword = await bcrypt.hash(new_password, 10);
                        UserModel.updateOne({ username: username }, { password: new_hashedPassword })
                            .then((ok) => {
                                res.json({ message: 'Uspesno promenjena lozinka' });
                            })
                    }
                });
        }
    }

    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        UserModel.findOne({ username: username })
            .then(async (user) => {
                console.log(user);
                if (user) {
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        res.status(200).json(user);
                    }
                    else {
                        res.json(null);
                    }
                }
                else {
                    res.json(null);
                }
            })
    }

    getStudents = (req: express.Request, res: express.Response) => {
        UserModel.countDocuments({ type: 'Ucenik' })
            .then((number) => {
                console.log(number);
                if (number)
                    res.json(number);
            })
    }

    getTeachers = (req: express.Request, res: express.Response) => {
        UserModel.countDocuments({ type: 'Nastavnik', active: true })
            .then((number) => {
                if (number)
                    res.json(number);
            })
    }

    getEngagedTeachersBySubject = async (req: express.Request, res: express.Response) => {
        try {
            const { sortBy, sortOrder, searchName, searchSubject } = req.query;

            const sortOptions: string | { [key: string]: 1 | -1 } | [string, 1 | -1][] = {};

            if (sortBy) {
                if (sortBy === 'personalInfo.first_name' || sortBy === 'personalInfo.last_name' || sortBy === 'schoolInfo.subjects') {
                    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
                } else {
                    return res.status(400).json({ error: 'Invalid sortBy value' });
                }
            }

            const searchCriteria: Record<string, any> = {};

            if (searchName) {
                searchCriteria['personalInfo.first_name'] = new RegExp(searchName.toString(), 'i');
            }
            if (searchSubject) {
                searchCriteria['schoolInfo.subjects'] = new RegExp(searchSubject.toString(), 'i');
            }

            const engagedTeachers = await UserModel.find({
                type: 'Nastavnik',
                'schoolInfo.subjects': { $exists: true, $ne: [] },
                ...searchCriteria,
            })
                .sort(sortOptions)
                .select('personalInfo.first_name personalInfo.last_name schoolInfo.subjects');

            res.json(engagedTeachers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    changeInfo = (req: express.Request, res: express.Response) => {
        const { username, first_name, last_name, email, phone, address, school_type, currentGrade, avatarPath } = req.body;

        console.log('Body: ' + school_type)

        const updateObject: Record<string, any> = {};

        if (first_name) {
            updateObject['personalInfo.first_name'] = first_name;
        }
        if (last_name) {
            updateObject['personalInfo.last_name'] = last_name;
        }
        if (email) {
            updateObject['personalInfo.email'] = email;
        }
        if (phone) {
            updateObject['personalInfo.phone'] = phone;
        }
        if (address) {
            updateObject['personalInfo.address'] = address;
        }
        if (school_type) {
            updateObject['schoolInfo.school_type'] = school_type;
        }
        if (currentGrade) {
            updateObject['schoolInfo.currentGrade'] = currentGrade;
        }
        if (avatarPath) {
            updateObject['personalInfo.avatar'] = avatarPath;
        }

        console.log(updateObject);

        const updateOperation = {
            $set: updateObject,
        };

        UserModel.findOneAndUpdate(
            {
                username: username
            },
            updateOperation,
            {
                new: true
            }
        )
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            })
            .then((result) => {
                console.log(result);
                res.json({ message: 'Uspesno izmenjeni podaci', user: result });
            });
    };

    getTeachersByGrade = async (req: express.Request, res: express.Response) => {
        const { type, year } = req.query;
        console.log(type);
        console.log(year);

        let teachersThatTeach: any[] = [];

        const teachers = await UserModel.find({
            type: 'Nastavnik',
            active: true
        })
            .select('personalInfo.first_name personalInfo.last_name schoolInfo.subjects schoolInfo.ageGroups username')
            .then((teachers: any) => {
                if (teachers) {
                    teachers.forEach((teacher: any) => {
                        let found = false;
                        console.log(teacher.schoolInfo['ageGroups']);
                        teacher.schoolInfo['ageGroups'].forEach((element: String) => {
                            let regex;
                            if(type != 'osnovna') {
                                regex = new RegExp('srednja', 'i')
                            }
                            else {
                                regex = new RegExp('osnovna', 'i')
                            }
                            console.log(regex.test(element.toLowerCase()))
                            if (regex.test(element.toLowerCase())) {
                                if (!found) {
                                    teachersThatTeach.push(teacher);
                                    found = true;
                                }
                            }
                        });
                    });
                }
            });
        if (type as string === 'osnovna') {
            teachersThatTeach = teachersThatTeach.filter((teacher: any) => {
                let teachesForYear = false;
                teacher.schoolInfo['ageGroups'].forEach((ageGroup: String) => {
                    if (year as unknown as number <= 4) {
                        if (ageGroup === 'Osnovna skola 1-4') {
                            teachesForYear = true;
                        }
                    }
                    if (year as unknown as number >= 5) {
                        if (ageGroup === 'Osnovna skola 5-8') {
                            teachesForYear = true;
                        }
                    }
                });
                return teachesForYear;
            });
        }
        res.json(teachersThatTeach);
    };

    filterTeachers = async (req: express.Request, res: express.Response) => {
        const { type, year, first_name, last_name, subject, sortBy, sortOrder } = req.query;

        const sortOptions: string | { [key: string]: 1 | -1 } | [string, 1 | -1][] = {};

        if (sortBy) {
            if (sortBy === 'personalInfo.first_name' || sortBy === 'personalInfo.last_name' || sortBy === 'schoolInfo.subjects') {
                sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
            } else {
                return res.status(400).json({ error: 'Invalid sortBy value' });
            }
        }

        const searchCriteria: Record<string, any> = {};

        if (first_name) {
            searchCriteria['personalInfo.first_name'] = new RegExp(first_name.toString(), 'i');
        }
        if (last_name) {
            searchCriteria['personalInfo.last_name'] = new RegExp(last_name.toString(), 'i');
        }

        if (subject) {
            searchCriteria['schoolInfo.subjects'] = new RegExp(subject.toString(), 'i');
        }


        let teachersThatTeach: any[] = [];

        const teachers = await UserModel.find({
            type: 'Nastavnik',
            'schoolInfo.subjects': { $exists: true, $ne: [] },
            ...searchCriteria
        })
            .sort(sortOptions)
            .select('personalInfo.first_name personalInfo.last_name schoolInfo.subjects schoolInfo.ageGroups username')
            .then((teachers: any) => {
                if (teachers) {
                    teachers.forEach((teacher: any) => {
                        let found = false;

                        teacher.schoolInfo['ageGroups'].forEach((element: String) => {
                            if (element.toLowerCase().includes(type as string)) {
                                if (!found) {
                                    teachersThatTeach.push(teacher);
                                    found = true;
                                }
                            }
                        });
                    });
                }
            });
        if (type as string === 'osnovna') {
            teachersThatTeach = teachersThatTeach.filter((teacher: any) => {
                let teachesForYear = false;
                teacher.schoolInfo['ageGroups'].forEach((ageGroup: String) => {
                    if (year as unknown as number <= 4) {
                        if (ageGroup === 'Osnovna skola 1-4. razred') {
                            teachesForYear = true;
                        }
                    }
                    if (year as unknown as number >= 5) {
                        if (ageGroup === 'Osnovna skola 5-8. razred') {
                            teachesForYear = true;
                        }
                    }
                });
                return teachesForYear;
            });
        }



        res.json(teachersThatTeach);
    }
    getTeacher = (req: express.Request, res: express.Response) => {
        const { username } = req.query;
        UserModel.findOne({ username: username })
            .select('username personalInfo.first_name personalInfo.last_name personalInfo.phone personalInfo.email personalInfo.avatar personalInfo.address schoolInfo.subjects')
            .then((teacher) => {
                console.log(teacher);
                if (teacher)
                    res.json(teacher);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getMyStudents = async (req: express.Request, res: express.Response) => {
        try {
            const { username } = req.query;
            const currentDate = new Date();

            // Find classes that have passed
            const classes = await ClassRequestsModel.find({
                username: username,
                status: true,
                'classInfo.dateEnd': { $lt: currentDate },
            }).select('personalInfo.username');

            // Extract unique usernames from the classes
            const uniqueUsernames = Array.from(
                new Set(classes.map((cls) => cls.personalInfo?.username).filter(Boolean))
            );

            console.log(uniqueUsernames)

            // Retrieve user details for the unique usernames from UserModel
            const users = await UserModel.find({ 'username': { $in: uniqueUsernames } });
            console.log(users);
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getStudentClasses = async (req: express.Request, res: express.Response) => {
        const { usernameT, usernameS } = req.query;
        console.log(usernameS);
        const currentDate = new Date();

        await ClassRequestsModel.find({
            username: usernameT,
            status: true,
            'personalInfo.username': usernameS,
            'classInfo.dateEnd': { $lt: currentDate }
        }).sort('classInfo.class')
        .then((classes) => {
            console.log(classes);
            res.json(classes);
        });
    }

    getStudentInfo = async (req: express.Request, res: express.Response) => {
        const { username } = req.query;
        UserModel.findOne({ username: username })
            .then((user) => {
                res.json(user);
            })
    }
}