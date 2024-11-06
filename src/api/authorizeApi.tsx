import AuthLocalStorage from "../AuthLocalStorage";
import { IRegister } from '../interfaces/IRegister';
import { ILogin } from '../interfaces/ILogin';
import Api from "./api";

export default class AuthorizeApi { 
    static isSignedIn(): boolean {
        return !!AuthLocalStorage.getToken();
    }

    login = async (userToLogin: ILogin) => {
        const response = await Api.post("Account/authenticate", userToLogin)
          .then((response) => {
            if (response.data.token !== null) {
              AuthLocalStorage.setToken(response.data.token);
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
               throw new Error(error.message);
            } 
          });

        return response;
      };

    register = async (registerForm: IRegister) => {
        const response = await Api.post("Account/register", registerForm);
        return response;
      };

    logout = () => {
        AuthLocalStorage.removeToken();
      };
}