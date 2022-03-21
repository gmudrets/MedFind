import axios from "axios";

const buildAPIPath = (basePath, parameters) => {
    let parametersNames = Object.keys(parameters);
    let result = basePath;
    if (parametersNames.length > 0) {
        result = result + '?';
        parametersNames.forEach((name, index) => {
            if (index < parametersNames.length - 1) {
                result = `${result}${name}=${parameters[name]}&`;
            } else {
                result = `${result}${name}=${parameters[name]}`;
            }
        });
    }
    return result;
};

export const getRequest = async (apiPath, params = {}, config = {}) => {
    try {
        let pathWithParams = buildAPIPath(apiPath, params);
        let response = await axios.get(pathWithParams, config);
        if (Object.keys(response.data).includes('error')) {
            throw Error(response.data);
        }
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const postRequest = async (apiPath, data, config = {}) => {
    try {
        let response = await axios.post(apiPath, data, config);
        if (Object.keys(response.data).includes('error')) {
            throw Error(response.data);
        }
        return response.data;
    } catch (err) {
        throw err;
    }
}