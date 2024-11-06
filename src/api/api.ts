import axios from "axios";
import BASE_URL from "../config";
import AuthLocalStorage from "../AuthLocalStorage";

interface HttpResponse {
  headers: any;
  data: any;
}

axios.interceptors.request.use(
    (config) => {
      const token = AuthLocalStorage.getToken() as string;
      
      config.headers = config.headers || {};
  
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      config.headers["Content-Type"] = "application/json";
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

const get = async (url: string, data?: any, paramsSerializer?: any)
: Promise<HttpResponse> => {
  const response = await axios.get(BASE_URL + url, {
    params: data,
    paramsSerializer: paramsSerializer,
  });
  return response;
};

const post = async (url: string, data?: any) => {
  const response = await axios.post(BASE_URL + url, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

const put = async (url: string, data?: any): Promise<HttpResponse> => {
  const response = await axios.put(BASE_URL + url, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

const patch = async (url: string, data?: any): Promise<HttpResponse> => {
  const response = await axios.patch(BASE_URL + url, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

const remove = async (
  url: string,
  data?: any,
  options: any = {}
): Promise<HttpResponse> => {
  const response = await axios.delete(BASE_URL + url, {
    ...options,
    params: data,
  });
  return response;
};

export default { get, post, put, patch, remove };
