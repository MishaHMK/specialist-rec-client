import axios, { AxiosError } from "axios";

export default class MeetingApi { 

    getAllMyMeetings = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Meeting/list")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };

    createMeeting = async (obj : object)  => {
        const response =  await axios.post("https://localhost:44335/api/Meeting/create", obj)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };

    deleteMeeting = async (id : number)  => {
        const response =  await axios.delete(`https://localhost:44335/api/Meeting/delete/${id}`)
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };
}