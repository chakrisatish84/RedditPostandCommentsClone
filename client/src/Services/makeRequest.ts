import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { appendFile } from "fs";

const config: AxiosRequestConfig = {
    baseURL: "http://localhost:3001",
    withCredentials: true
}

const api = axios.create(config);

export async function makeRequest(url: string, options?: AxiosRequestConfig) {
    return api(url, options)
        .then((response: AxiosResponse) => { return response.data  })
        .catch((error: AxiosError) => Promise.reject(error?.message ?? "Error"))
}