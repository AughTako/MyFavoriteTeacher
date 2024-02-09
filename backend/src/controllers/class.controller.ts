import express from 'express';
import ClassRequestsModel from '../models/requests_class.model';
export class ClassController {
    sendRequest = async (req: express.Request, res: express.Response) => {
        const { username, studentUsername, first_name, last_name, className, dateOf, topic, doubleFlag } = req.body;

        const workHoursStart = new Date(dateOf);
        workHoursStart.setHours(11, 0, 0, 0);
        const workHoursEnd = new Date(dateOf);
        workHoursEnd.setHours(19, 0, 0, 0);

        const classDate = new Date(dateOf);

        classDate.setHours(classDate.getHours() + 1)

        const classDateTemp = new Date(classDate);
        const howMuchTimeToAdd = doubleFlag ? 2 : 1;

        if (classDateTemp < workHoursStart || classDateTemp > workHoursEnd) {
            return res.json({ message: 'Vreme van radnih casova nastavnika' }).status(400);
        };
        const classDateUTC = classDate.toISOString();
        // console.log(workHoursStartUTC + ' ' + workHoursEndUTC + ' ' + classDateUTC + ' -> ' + classDateHourTemp)

        const classDateStart = new Date(new Date(classDateUTC).setHours(new Date(classDateUTC).getHours()));
        const classDateEnd = new Date(new Date(classDateUTC).setHours(new Date(classDateUTC).getHours() + howMuchTimeToAdd));


        let alreadyHasFlag = false;

        await ClassRequestsModel.find({
            'username': username,
            // 'status': true
        })
            .then((activeRequests) => {
                activeRequests.forEach(request => {
                    const dateStart = request.classInfo?.dateStart ?? 0;
                    const dateEnd = request.classInfo?.dateEnd ?? 0;

                    if ((dateStart >= classDateStart) && (dateStart <= classDateEnd)) {
                        alreadyHasFlag = true
                    }
                    else if ((dateEnd >= classDateStart) && (dateEnd <= classDateEnd)) {
                        alreadyHasFlag = true
                    }
                    else if ((dateStart <= classDateStart && classDateStart <= dateEnd) && (dateStart <= classDateEnd && classDateEnd <= dateEnd)) {
                        alreadyHasFlag = true
                    }
                });
            });
        if (alreadyHasFlag) {
            res.json({ message: 'Nastavnik vec ima cas' }).status(400)
        }
        else {
            await ClassRequestsModel.create({
                'username': username,
                'personalInfo.username': studentUsername,
                'personalInfo.first_name': first_name,
                'personalInfo.last_name': last_name,
                'classInfo.class': className,
                'classInfo.topic': topic,
                'classInfo.dateStart': classDateStart,
                'classInfo.dateEnd': classDateEnd,
                'status': false,
            })
                .then((new_request: any) => {
                    console.log('New request: ', new_request);
                    res.status(200).json({ message: 'Uspesno zakazan cas, cekajte da nastavnik odobri!' });
                })
                .catch((err: any) => {
                    console.log(err);
                    res.status(500).json({ message: 'Internal server error' });
                });
        }
    }


    getRequests = (req: express.Request, res: express.Response) => {
        const { username } = req.query
        ClassRequestsModel.find({ username: username, status: false })
            .limit(5)
            .then((requests) => {
                res.json(requests);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    acceptClass = (req: express.Request, res: express.Response) => {
        const { id } = req.query;
        ClassRequestsModel.findByIdAndUpdate(id, { status: true })
            .then((ok) => {
                res.json({ message: 'Uspesno prihvacen cas' })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getAccepted = (req: express.Request, res: express.Response) => {
        const {username} = req.query;
        ClassRequestsModel.find({username: username, status: true})
        .sort('classInfo.dateStart')
        .then((requests: any) => {
            res.json(requests);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    getAllClasses = async (req: express.Request, res: express.Response) => {
        await ClassRequestsModel.find({status: true})
        .then((classes) => {
            res.json(classes);
        })
    }
}