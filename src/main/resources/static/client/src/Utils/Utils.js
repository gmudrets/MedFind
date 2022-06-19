import {External} from "../Consts/apiPaths";
import icon from "../Assets/Images/icon.png";
import moment from "moment";
import * as React from "react";

export const getSafe = (p, o) => p.reduce((xs, x) => (xs && x in xs ? xs[x] : null), o);

export const getImageURL = (data) => {
    let url = External.EXTERNAL_FILES_URL;
    if (data[0] === undefined){
        url = icon;
    }
    else {
        url += data[0];
    }
    return url;
}

export const formatDate = (dateString) => {
    let date = new moment(dateString);

    return date.format('DD/MM/yyyy');
}

export const dosageUnits = (unitType) => {
    switch (unitType) {
        case 'משחה':
        case 'קרם':
        case 'ג\'ל':
            return <>&nbsp; (%)</>
        case 'אבקה להכנת תרחיף':
        case 'סירופ':
        case 'תמיסה להזרקה':
        case 'טיפות':
        case 'טיפות עיניים':
        case 'טיפות אוזניים':
        case 'טיפות אף':
            return <>&nbsp; (ml)</>
        case 'פתילות':
        case 'טבליה':
        case 'קפליות':
        case 'טבליות מצופות פילם':
            return <>&nbsp; (mg)</>
        default:
            return <></>
    }
}