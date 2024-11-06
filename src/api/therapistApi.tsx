import Api from "./api";
import axios, { AxiosError } from "axios";

export default class TherapistApi {

  getTherapists = async (page: number, pageSize: number, specialization: string) => {
    try {
      console.log(page + ' ' + pageSize + ' ' + specialization);
      const response = await axios.get(`https://localhost:44335/api/Account/therapists/`,{
        params: { page, pageSize, specialization }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch therapists:", error);
      throw error;
    }
  }

  static async getSpecializations() {
    try {
      const response = await Api.get("Account/specs");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
      throw error;
    }
  }
}