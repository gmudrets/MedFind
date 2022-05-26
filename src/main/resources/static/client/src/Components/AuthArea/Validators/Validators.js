import {validate} from "react-email-validator"

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
export const phoneNumLength = (phoneNum) => {
	return phoneNum.length === 10;
}
export const phoneNumNumbersOnly = (phoneNum) => {
	let validChars = /^[0-9]*$/
	return validChars.test(phoneNum);
}
export const cityEmpty = (city) => {
	return city.length === 0;
}

export const userNameFullValidate = (userName, sendError) => {
	if (usernameEmpty(userName)) {
		sendError("נא הזן שם משתמש");
		return false;
	} else if (!usernameMinChars(userName)) {
		sendError("שם המשתמש חייב להיות באורך 8 תווים לפחות");
		return false;
	} else if (!usernameValid(userName)) {
		sendError("אנא הזן תווים באנגלית וספרות בלבד")
		return false;
	}
	return true;
}
export const firstNameFullValidate = (firstName, sendError) => {
	if (firstnameEmpty(firstName)) {
		sendError("נא הזן שם פרטי");
		return false;
	}
	return true;
}
export const lastNameFullValidate = (lastName, sendError) => {
	if (lastnameEmpty(lastName)) {
		sendError("נא הזן שם משפחה");
		return false;
	}
	return true;
}
export const mailFullValidate = (mailAddress, sendError) => {
	if (emailEmpty(mailAddress)) {
		sendError("נא הזן כתובת אימייל");
		return false;
	} else if (!emailValid(mailAddress)) {
		sendError("כתובת אימייל לא תקינה");
		return false;
	}
	return true;
}
export const passwordFullValidate = (password, sendError) => {
	if (passwordEmpty(password)) {
		sendError("נא הזן סיסמה");
		return false;
	} else if (!passwordMinChars(password)) {
		sendError("סיסמה צריכה להכיל לפחות 8 תווים");
		return false;
	} else if (!passwordValid(password)) {
		sendError("סיסמה יכולה להכיל תווים, ספרות וסמלים מיוחדים בלבד");
		return false;
	}
	return true;
}
export const confirmPasswordFullValidate = (firstPass, secondPass, sendError) => {
	if (!passwordsMatches(firstPass, secondPass)) {
		sendError("הסיסמאות לא זהות, אנא הזן שוב");
		return false;
	}
	return true;

export const isFieldContainsOnlyDigits = (fld) => {
    let validChars = /^[0-9]*$/
    return !validChars.test(fld);
}
export const phoneNumFullValidate = (phoneNum, sendError) => {
	if (!phoneNumLength((phoneNum))) {
		sendError("מספר טלפון חייב להיות באורך 10 מספרים בדיוק");
		return false;
	} else if (!phoneNumNumbersOnly(phoneNum)) {
		sendError("אנא הזן ספרות בלבד");
		return false;
	}
	return true;
}
export const cityFullValidate = (city, sendError) => {
	if (cityEmpty(city)) {
		sendError("נא הזן עיר מגורים");
		return false;
	}
	return true;
}


