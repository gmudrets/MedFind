import { validate } from "react-email-validator"

// Fields validators

export const usernameEmpty = (username) => {
    return username.length === 0;
}

export const usernameMinChars = (username) => {
    return username.length >= 8;
}

export const usernameValid = (username) => {
    let validChars = /^[A-Za-z0-9]*$/
    return validChars.test(username);
}

export const passwordsMatches = (password, matchPassword) => {
    return password === matchPassword;
}

export const passwordEmpty = (password) => {
    return password.length === 0;
}

export const passwordValid = (password) => {
    let validChars = /^[A-Za-z0-9!@#$%^&*()-_~`+-]*$/
    return validChars.test(password);
}

export const passwordMinChars = (password) => {
    return password.length >= 8;
}

export const emailEmpty = (email) => {
    return email.length === 0;
}

export const emailValid = (email) => {
    return validate(email);
}

export const firstnameEmpty = (firstname) => {
    return firstname.length === 0;
}

export const lastnameEmpty = (lastname) => {
    return lastname.length === 0;
}


