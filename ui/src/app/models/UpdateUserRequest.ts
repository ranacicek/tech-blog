export default interface UpdateUserRequest {
    firstName: string;
    surname: string;
    about: string;
    password: string;
    passwordConfirm: string;
}