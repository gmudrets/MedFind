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
	return validChars.test(fld);
}
export const isFieldContainsOnlyDigits = (fld) => {
	let validChars = /^[0-9]*$/
	return validChars.test(fld);
}
export const phoneNumLength = (phoneNum) => {
	return phoneNum.length === 10;
}


export const firstNameFullValidate = (firstName, sendError, short = false) => {
	if (isFieldEmpty(firstName)) {
		sendError(short ? "הזן שם פרטי" : "נא הזן שם פרטי");
		return false;
	}
	return true;
}
export const lastNameFullValidate = (lastName, sendError, short = false) => {
	if (isFieldEmpty(lastName)) {
		sendError(short ? "הזן שם משפחה" : "נא הזן שם משפחה");
		return false;
	}
	return true;
}
export const mailFullValidate = (mailAddress, sendError, short = false) => {
	if (isFieldEmpty(mailAddress)) {
		sendError(short ? "הזן אימייל" : "נא הזן כתובת אימייל");
		return false;
	} else if (!emailValid(mailAddress)) {
		sendError(short ? "לא תקין" : "כתובת אימייל לא תקינה");
		return false;
	}
	return true;
}
export const passwordFullValidate = (password, sendError, short = false) => {
	if (isFieldEmpty(password)) {
		sendError(short ? "הזן ססמא" : "נא הזן סיסמה");
		return false;
	} else if (!passwordMinChars(password)) {
		sendError(short ? "לפחות 8 תווים" : "סיסמה צריכה להכיל לפחות 8 תווים");
		return false;
	} else if (!passwordValid(password)) {
		sendError(short ? "תווים ללא חוקיים" : "סיסמה יכולה להכיל תווים, ספרות וסמלים מיוחדים בלבד");
		return false;
	}
	return true;
}
export const confirmPasswordFullValidate = (firstPass, secondPass, sendError, short = false) => {
	if (!passwordsMatches(firstPass, secondPass)) {
		sendError(short ? "לא זהה" : "הסיסמאות לא זהות, אנא הזן שוב");
		return false;
	}
	return true;

}
export const phoneNumFullValidate = (phoneNum, sendError, short = false) => {
	if(isFieldEmpty(phoneNum)){//phone num is optional, allow to not exist
		return true;
	}
	if (!phoneNumLength((phoneNum))) {
		sendError(short ? "10 ספרות" : "מספר טלפון חייב להיות באורך 10 ספרות בדיוק");
		return false;
	} else if (!isFieldContainsOnlyDigits(phoneNum)) {
		sendError(short ? "ספרות בלבד" : "אנא הזן ספרות בלבד");
		return false;
	}
	return true;
}
export const cityFullValidate = (city, sendError, short = false) => {
	if (isFieldEmpty(city)){//city is optional, allow to not exist
		return true;
	}
	if(!isFieldContainsOnlyLetters(city)){
		sendError(short? "רק עברית"  : "עיר מגורים יכולה להכיל אותיות בעברית בלבד");
		return false;
	}
	return true;

}

