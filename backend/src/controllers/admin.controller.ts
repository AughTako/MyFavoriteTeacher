import bcrypt from 'bcrypt';
import { ChartOptions } from 'chart.js';
import express from 'express';
import fs from 'fs';
import AdminModel from '../models/admin.model';
import RequestsModel from '../models/requests.model';
import UserModel from '../models/user.model';

const chartOptionsTeachers: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Teachers by Subject and Age',
        },
    },
};

const chartOptionsWeeklyHours: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Average Weekly Hours',
        },
    },
};

export class AdminController {
    login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        try {
            const admin = await AdminModel.findOne({ username: username });

            if (admin) {
                const hashedPassword = admin.password;
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    res.status(200).json(admin);
                } else {
                    res.status(401).json({ message: 'Invalid password' });
                }
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getRequests = (req: express.Request, res: express.Response) => {
        RequestsModel.find()
            .then((requests) =>
                res.json(requests)
            )
            .catch((error) =>
                res.json(error)
            )
    }

    accept = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        UserModel.findOneAndUpdate({ username: username }, { active: true })
            .then((ok) => {
                res.json({ message: 'Uspesno odobren korisnik' })
            })
        RequestsModel.findOneAndDelete({ username: username })
            .then((ok) => {
                res.status(200)
            })
    }

    decline = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        UserModel.findOneAndDelete({ username: username })
            .then((user) => {
                if (!user) {
                    // User not found
                    return res.status(404).json({ message: 'User not found' });
                }

                // Delete the user's avatar file
                if (user.personalInfo && user.personalInfo.avatar) {
                    fs.unlinkSync(user.personalInfo.avatar);
                }

                // Delete the user's CV file
                if (user.CV) {
                    fs.unlinkSync(user.CV);
                }

                return res.json({ message: 'Uspesno odbijen korisnik' });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            });

        // Delete the user's request
        RequestsModel.findOneAndDelete({ username: username })
            .then(() => {
                // Do nothing here or handle success if needed
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            });
    };

    // getChartData = async (req: express.Request, res: express.Response) => {
    //     try {
    //         const teachersBySubject = await this.getTeachersBySubject();
    //         const teachersByAge = await this.getTeachersByAge();
    //         const genderDistributionTeachers = await this.getGenderDistribution('Nastavnik');
    //         const genderDistributionStudents = await this.getGenderDistribution('Ucenik');
    //         const weeklyHours = await this.getWeeklyHours();

    //         console.log(teachersByAge)
    //         console.log(teachersBySubject)
    //         console.log(genderDistributionStudents)
    //         console.log(genderDistributionTeachers)
    //         console.log(weeklyHours);

    //         const chartOptionsTeachers: ChartOptions = {
    //             responsive: true,
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                 },
    //             },
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Teachers by Subject and Age',
    //                 },
    //             },
    //             animation: {
    //                 duration: 2000, // Set animation duration in milliseconds
    //                 easing: 'easeInOutQuad', // Set animation easing function
    //             },
    //             data: [{
    //                 type: 'bar',
    //                 label: 'Teachers by Subject',
    //                 data: teachersBySubject.map(subject => subject.count),
    //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //                 borderColor: 'rgba(75, 192, 192, 1)',
    //                 borderWidth: 1,
    //             }, {
    //                 type: 'line',
    //                 label: 'Teachers by Age',
    //                 data: teachersByAge.map(ageGroup => ageGroup.count),
    //                 fill: false,
    //                 borderColor: 'rgba(255, 99, 132, 1)',
    //                 borderWidth: 2,
    //             }],
    //         };

    //         const chartOptionsGenderTeachers: ChartOptions = {
    //             responsive: true,
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Gender Distribution Among Teachers',
    //                 },
    //             },
    //             animation: {
    //                 duration: 1500,
    //                 easing: 'easeInOutQuint',
    //             },
    //         };

    //         const chartOptionsGenderStudents: ChartOptions = {
    //             responsive: true,
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Gender Distribution Among Students',
    //                 },
    //             },
    //             animation: {
    //                 duration: 1500,
    //                 easing: 'easeInOutQuint',
    //             },
    //         };

    //         const chartOptionsWeeklyHours: ChartOptions = {
    //             responsive: true,
    //             scales: {
    //                 y: { beginAtZero: true }
    //             },
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Average Weekly Hours',
    //                 },
    //             },
    //             animation: {
    //                 duration: 2000,
    //                 easing: 'easeInOutQuad',
    //             },
    //         };

    //         console.log(
    //             chartOptionsTeachers,
    //             chartOptionsGenderTeachers,
    //             chartOptionsGenderStudents,
    //             chartOptionsWeeklyHours)

    //         res.json({
    //             chartOptionsTeachers,
    //             chartOptionsGenderTeachers,
    //             chartOptionsGenderStudents,
    //             chartOptionsWeeklyHours,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.json({ message: 'Internal server error' });
    //     }
    // };

    // // New methods for chart data
    // async getTeachersBySubject() {
    //     const subjectsCount = await UserModel.aggregate([
    //         { $match: { type: 'Nastavnik' } },
    //         { $unwind: '$schoolInfo.subjects' },
    //         { $group: { _id: '$schoolInfo.subjects', count: { $sum: 1 } } },
    //     ]);

    //     return subjectsCount.map((subject: any) => subject.count);
    // }

    // async getTeachersByAge() {
    //     const ageGroupsCount = await UserModel.aggregate([
    //         { $match: { type: 'Nastavnik' } },
    //         { $unwind: '$schoolInfo.ageGroups' },
    //         { $group: { _id: '$schoolInfo.ageGroups', count: { $sum: 1 } } },
    //     ]);

    //     return ageGroupsCount.map((ageGroup: any) => ageGroup.count);
    // }

    // async getGenderDistribution(type: string) {
    //     const genderDistributionCount = await UserModel.aggregate([
    //         { $match: { type: type } },
    //         { $group: { _id: '$gender', count: { $sum: 1 } } },
    //     ]);

    //     return genderDistributionCount.map((gender: any) => gender.count);
    // }

    // async getWeeklyHours() {
    //     const weeklyHours = await UserModel.aggregate([
    //         { $match: { type: 'Nastavnik' } },
    //         {
    //             $group: {
    //                 _id: { $isoWeek: '$_id.getTimestamp()' }, // Group by ISO week of the creation timestamp
    //                 totalHours: { $sum: { $subtract: [new Date('$workInfo.end_hour'), new Date('$workInfo.start_hour')] } },
    //             },
    //         },
    //     ]);

    //     return weeklyHours.map((week: any) => {
    //         return { week: week._id, averageHours: week.totalHours / 3600000 }; // Convert milliseconds to hours
    //     });
    // }

    // async getMonthlyHours() {
    //     const monthlyHours = await UserModel.aggregate([
    //         { $match: { type: 'Nastavnik' } },
    //         {
    //             $group: {
    //                 _id: { $month: '$createdAt' },
    //                 totalHours: { $sum: '$workInfo.end_hour' },
    //             },
    //         },
    //     ]);

    //     return monthlyHours.map((month: any) => month.totalHours);
    // }
}