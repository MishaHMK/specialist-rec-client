import { createStore, createHook, Action } from 'react-sweet-state';
import axios, { AxiosError } from "axios";
import { SpecialityMapping } from '../asset/specs';

type State = { roles: any, users: any, specs: any, dates: string[],
               appointments: any, times: any, IsAppShown: any, docNameToReview: any, 
               IsThreadShown: any,  docSurnameToReview: any, docFatherNameToReview: any, 
               doctorIdSelected: any, doctorId: any, doctorName: any, patientId: any, currentUserId: any, 
               currentUserIntroduction: any, IsReviewShown: any, currentRole: any, eventEditingOn: any, 
               currentUserSpeciality: any, currentName: any, currentSurname: any};

type Actions = typeof actions;


const initialState: State = {
    roles: [],
    users: [],
    specs: ["Trauma Therapy",
            "Addiction Treatment",
            "Child Therapy",
            "Family Therapy",
            "Cognitive Therapy"],
    dates: [],
    appointments:[],
    times: [],
    IsAppShown: false,
    IsThreadShown: false,
    IsReviewShown: false,
    docNameToReview: '',
    docFatherNameToReview: '',
    docSurnameToReview: '',
    doctorIdSelected: '',
    doctorId: '',
    doctorName: '',
    patientId: '',
    currentRole: '',
    currentName: '',
    currentSurname: '',
    currentUserId: '',
    currentUserIntroduction: '',
    currentUserSpeciality: '',
    eventEditingOn: false,
};

const actions = {
    getAllRoles: () : Action<State> => 
    async ({ setState, getState }) => {
        const roles = await axios.get("https://localhost:44335/api/Account/roles");
        setState({
          roles: roles.data
        });
        console.log(roles.data);
    }, 

    getAllTimes: () : Action<State> => 
    async ({ setState, getState }) => {
        const times = await axios.get("https://localhost:44335/api/Account/times");
        setState({
          times: times.data
        });
    }, 

    getAllAppointmentsDates: () : Action<State> => 
    async ({ setState, getState }) => {
        const dates = await axios.get("https://localhost:44335/api/Appointment/dates");

        var dateArray = [];

        for(var i = 0; i < dates.data.length; i++)
        { 
            dateArray.push(dates.data[i].startDate);
        }

        setState({
          dates: dateArray
        });
    }, 

    makeAppModalVisible: (): Action<State> => 
    async ({ setState }) => 
    {
      setState({
        IsAppShown: true
      });
    },

    getAppointments: (doctorId: string, patientId: string, role: string) : Action<State> => 
    async ({ setState, getState }) => {
          const response = await axios.get("https://localhost:44335/api/Appointment/GetCalendarData/", { params: { 
            doctorId: doctorId,
            patientId: patientId, 
            role: role 
          }});
        setState({
          appointments: response.data
        });
    },

    getAllUsers: () : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44335/api/Account/users");
        setState({
          users: response.data
        });
    },

    
    setUserRole: (role: any) : Action<State> => 
    async ({ setState, getState }) => {
        setState({
          currentRole: role
        });
    },

    getUserById: (id: any) : Action<State> => 
    async ({ setState, getState }) => {
        const response = await axios.get("https://localhost:44335/api/Account/users/" + id);
        setState({
          currentUserId: response.data.id,
          currentName: response.data.name,
          currentSurname: response.data.surname
        });

        console.log(response.data);
        return response.data;
    },


    deleteAppointment: (id: any) : Action<State> => 
    ({ setState, getState }) => {
      if(window.confirm('Are you sure?')){
        axios.delete("https://localhost:44335/api/Appointment/Delete/" + id);
        const newList = getState().appointments.filter((app : any) => app.id != id);
        setState({
          appointments: newList
        });
      }
    },

    updateAppointment: (id: any, Appointment: any) : Action<State> =>
    async ({ setState, getState }) => {
      var appointment: any = { ...Appointment };
      console.log(appointment);
      const response = await axios.put("https://localhost:44335/api/Appointment/Edit/" + id, appointment);

      const updList = getState().appointments.map((app : any)=> {
        if(id === app.id){
           return appointment; }
        return app;
      })

      setState({appointments: updList });
      return response.data;
    }, 

    updateUser: (id: any, UserForm: any) : Action<State> =>
    async ({ setState, getState }) => {
      var form: any = { ...UserForm };
      const response = await axios.put("https://localhost:44335/api/Account/Edit/" + id, form);

      const updList = getState().users.map((app : any)=> {
        if(id === app.id){
           return form; }
        return app;
      })

      setState({users: updList });
      return response.data;
    }, 

    approveAppointment: (id: any, state: boolean) : Action<State> =>
    async ({ setState, getState }) => {
      const response = await axios.patch("https://localhost:44335/api/Appointment/Approve/" + id + "/" + !state); 
      const updList = getState().appointments.map((app : any)=> {
        if(id === app.id){
           return response.data; }
        return app;
      })
      setState({appointments: updList });
      return response.data;
    }
};

const Store = createStore<State, Actions>({
    initialState,
    actions
  });
  
export const useUserStore = createHook(Store);