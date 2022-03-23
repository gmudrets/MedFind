import axios from "axios";

const axiosConfig = {
    // Tomcat dev url
    baseURL: 'http://localhost:8080/',
    timeout: 30000,
};

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
        if (process.env.NODE_ENV !== "production") {
            config = axiosConfig;
        }

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
        if (process.env.NODE_ENV !== "production") {
            config = axiosConfig;
        }

        let response = await axios.post(apiPath, data, config);
        if (Object.keys(response.data).includes('error')) {
            throw Error(response.data);
        }
        return response.data;
    } catch (err) {
        throw err;
    }
}