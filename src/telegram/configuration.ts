import axios from 'axios';

const apiToken = "7426367377:AAHB9xMIbmPFQrlVG5Hgtr2rTnTwaP_Ji6Y";
const BASE_URL = `https://api.telegram.org/bot${apiToken}`;

function getAxiosInstance() {
    return {
        get(method: string, params?: Record<string, any>) {
            return axios.get(`/${method}`, {
                baseURL: BASE_URL, 
                params
            });
        },
        post(method: string, data?: any, headers?: Record<string, any>) {
            return axios({
                method: "post",
                baseURL: BASE_URL,  
                url: `/${method}`,
                data,
                headers,
            });
        }
    };
}

export const axiosInstance = getAxiosInstance();
