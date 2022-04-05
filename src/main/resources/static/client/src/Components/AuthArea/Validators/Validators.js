import { validate } from "react-email-validator"

// Fields validators

export const usernameEmpty = (username) => {
    if (username.length === 0){
        return true;
    }
    return false;
}

export const usernameMinChars = (username) => {
    if (username.length >= 8){
        return true;
    }
    return false;
}

export const usernameValid = (username) => {
    //Check username contains only allowed chars.
    return true;
}

export const passwordsMatches = (password, matchPassword) => {
    if (password !== matchPassword){
        return false;
    }
    return true;
}

export const passwordEmpty = (password) => {
    if (password.length === 0){
        return true;
    }
    return false;
}

export const passwordValid = (password) => {
    //Check password contains only allowed chars.
    return true;
}

export const passwordMinChars = (password) => {
    if (password.length >= 8) {
        return true;
    }
    return false;
}

export const emailEmpty = (email) => {
    if (email.length === 0){
        return true;
    }
    return false;
}

export const emailValid = (email) => {
    if(validate(email)){
        return true;
    }
    return false;
}

export const firstnameEmpty = (firstname) => {
    if(firstname.length === 0) {
        return true;
    }
    return false;
}

export const lastnameEmpty = (lastname) => {
    if(lastname.length === 0) {
        return true;
    }
    return false;
}


