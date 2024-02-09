import bcrypt from 'bcrypt';
import express from 'express';
import RequestsModel from '../models/requests.model';
import userModel from '../models/user.model';

export class RegisterController {
    register = async (req: express.Request, res: express.Response) => {
        try {
            const {
                username,
                password,
                type,
                sec_question,
                sec_answer,
                first_name,
                last_name,
                gender,
                address,
                phone,
                email,
                avatar,
                CV,
                school_type,
                school_year,
                subjects,
                ageGroups,
                sourceOfInformation,
            } = req.body;


            const hashedPassword = await bcrypt.hash(password, 10)
            let userData = {
                username: username,
                password: hashedPassword,
                type: type,
                securityQuestion: {
                    question: sec_question,
                    answer: sec_answer,
                },
                personalInfo: {
                    first_name: first_name,
                    last_name: last_name,
                    gender: gender,
                    address: address,
                    phone: phone,
                    email: email,
                    avatar: avatar
                },
                schoolInfo: {
                    school_type: type === 'Ucenik' ? school_type : null,
                    currentGrade: type === 'Ucenik' ? school_year : null,
                    subjects: type === 'Nastavnik' ? subjects : null,
                    ageGroups: type === 'Nastavnik' ? ageGroups : null,
                    sourceOfInformation: type === 'Nastavnik' ? sourceOfInformation : null,
                },
                workInfo: {
                    start_hour: type==='Nastavnik'? new Date(): null,
                    end_hour: type==='Nastavnik'? '18:00 PM': null
                },
                CV: type === 'Nastavnik' ? CV : null,
                active: type === 'Ucenik' ? true : false,
            }
            await userModel.create(userData)

            res.status(200).json({ success: true, message: 'Korisnik uspesno registrovan' })
            if (type === 'Nastavnik') {
                let requestData = {
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    CV: CV
                }
                console.log(requestData)
                await RequestsModel.create(requestData)
            }
        } catch (error: any) {
            console.error('Error registering user:', error);
            res.status(500).json({ success: false, message: 'Korisnik vec postoji ili prazna polja', error: error.message });
        }
    };
}
