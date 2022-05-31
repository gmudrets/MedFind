import {External} from "../Consts/apiPaths";
import icon from "../Assets/Images/icon.png";
import moment from "moment";

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