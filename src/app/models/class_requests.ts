export class ClassRequest {
    username: String;
    _id: String;
    personalInfo: {
        username: String,
        first_name: String,
        last_name: String,
    };
    classInfo: {
        class: String,
        topic: String,
        dateStart: Date,
        dateEnd: Date,
        formattedDateStart: String
        formattedDateEnd: String
    }
    status: boolean
}