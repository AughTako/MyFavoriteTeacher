export class User {
    username: String;
    password: String;
    type: String;
    securityQuestion: {
        sec_question: String;
        sec_answer: String;
    };
    personalInfo: {
        first_name: String;
        last_name: String;
        gender: String;
        address: String;
        phone: String;
        email: String;
        avatar: String;
    }
    schoolInfo: {
        school_type: String;
        currentGrade: number;
    }
    CV: String
}