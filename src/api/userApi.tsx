import axios, { AxiosError } from "axios";

export default class UserApi { 

    getById = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44335/api/Account/user/" + id);
      
        return response;
    };

    getUserProfile = async () => {
        return await axios.get("https://localhost:44335/api/Account/profile");
    }
}