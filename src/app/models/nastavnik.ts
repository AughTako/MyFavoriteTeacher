export class TeacherWrapper {
    username: String;
    personalInfo: {
        first_name: String;
        last_name: String;
        phone: String;
        address: String;
        email: String;
        avatar: String;
    }
    schoolInfo: {
        subjects: String[]
    }
}