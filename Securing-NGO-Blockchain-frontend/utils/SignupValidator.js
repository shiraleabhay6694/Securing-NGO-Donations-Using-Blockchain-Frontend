import FormValidator from './FormValidator';



const validEmail = (value) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(value);
};
const emptyCheck = (value) => value && value.trim().length > 0;

export default function SignupValidator() {
    const validator = new FormValidator();
    validator
        .addRule('ngo_name',emptyCheck,'Please Enter NGO Name')
        .addRule('founder',emptyCheck,'Please Enter Founder Name')
        .addRule('email', validEmail, 'Please Enter Valid Email')
        .addRule('vision',emptyCheck,'Please Enter your vision')
        .addRule('about',emptyCheck,'Please Enter Description')
        .addRule('password', emptyCheck, 'Please Enter Password');

    return validator;
}