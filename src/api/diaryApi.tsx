import axios, { AxiosError } from "axios";

export default class DiaryApi { 

    addEntry = async (description: string, emotionId: number, value: number) => {
        const response = await axios.post("https://localhost:44335/api/Diary/add", 
            { description, emotionId, value },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            }
        ).catch((error: AxiosError) => {
            throw new Error(error.message);
        });

        return response;
    };

    getAllEmotions = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Emotions")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };

    getDiaryId = async ()  => {
        const response =  await axios.get("https://localhost:44335/api/Diary/mydiary")
        .catch((error: AxiosError) => {
            throw new Error(error.message);
        }); 

        return response;
    };


    getAllEntries = async (id: number, page: number, pageSize: number) => {
        try {
        const response = await axios.get(`https://localhost:44335/api/Diary/entries/${id}`, {
            params: { page, pageSize },
        });
        
        if (response && response.data) {
            return {
            entries: response.data.entries || [],
            totalCount: response.data.totalCount || 0,
            };
        } else {
            throw new Error('No data available');
        }
        } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching diary entries:', axiosError.message);
        throw new Error(axiosError.message);
        }
    };

    deleteEntry = async (id: number) => {
        try {
          const response = await axios.delete(`https://localhost:44335/api/Diary/entryremove/${id}`);
          return response;
        } catch (error) {
          throw new Error("Failed to delete entry");
        }
    };

    createDiary = async () => {
        try {
          const response = await axios.post(`https://localhost:44335/api/Diary/create`);
            return response;
        } 
        catch (error) {
          throw new Error("Failed to create diary");
        }
    };

    ifDiaryExistst = async () => {
        try {
          const response = await axios.get(`https://localhost:44335/api/Diary/existdiary`);
            return response;
        } 
        catch (error) {
          throw new Error("Failed to find out");
        }
    };

}