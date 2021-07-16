import FormValidator from './FormValidator';

const validEmail = (value) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(value);
};
const emptyCheck = (value) => value && value.trim().length > 0;

export default function LoginValidator() {
    const validator = new FormValidator();
    validator
        .addRule('email', validEmail, 'Please Enter Valid Email')
        .addRule('password', emptyCheck, 'Please Enter Password');

    return validator;
}