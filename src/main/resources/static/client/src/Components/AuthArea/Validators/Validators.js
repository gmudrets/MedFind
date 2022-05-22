import { validate } from "react-email-validator"

// Fields validators

export const passwordsMatches = (password, matchPassword) => {
    return password === matchPassword;
}

export const passwordValid = (password) => {
    let validChars = /^[A-Za-z0-9!@#$%^&*()-_~`+-]*$/
    return validChars.test(password);
}

export const passwordMinChars = (password) => {
    return password.length >= 8;
}

export const emailValid = (email) => {
    return validate(email);
}

export const isFieldEmpty = (fld) => {
    return fld.length === 0;
}

export const isFieldContainsOnlyLetters = (fld) => {
    let validChars = /^[\u0590-\u05ff -']*$/
    return !validChars.test(fld);
}

export const isFieldContainsOnlyDigits = (fld) => {
    let validChars = /^[0-9]*$/
    return !validChars.test(fld);
}
