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
            </Routes> 
          </NavBar>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
