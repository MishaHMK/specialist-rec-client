import { Login } from './components/Login';
import { Intro } from './components/Intro';
import { Register } from './components/Register';
import { DiaryPage } from './components/Diary';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from './components/NavBar';
import { RecomendPage } from './components/RecomendPage';
import { TherapistsPage } from './components/TherapistsPage';
import { MeetingsPage } from './components/Meetings';
import { ProfilePage } from './components/ProfilePage';
import { UsersDiary } from './components/UsersDiary';
import { PatientsPage } from './components/Patients';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="container">
          <NavBar>
            <Routes>
              <Route path="/main" element={<Intro/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              <Route path="/therapists" element={<TherapistsPage/>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/recommendation" element={<RecomendPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/diary/:patientId/:patientName" element={<UsersDiary />} />
            </Routes> 
          </NavBar>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
