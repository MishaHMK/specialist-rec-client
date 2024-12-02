import axios, { AxiosError } from "axios";

export default class recommendationApi { 

    resetTrainingData = async () => {
        const response = await axios.post("https://localhost:44335/api/Recommendation/Save");
        return response;
    };

    trainModel = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Recommendation/Train")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
          }); 

        return response;
   };

   predictSpec = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Recommendation/Predict")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };

    recommend = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Recommendation/Recommendation")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 
        
        return response;
    };

    answer = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Recommendation/GetAnswer")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };
}