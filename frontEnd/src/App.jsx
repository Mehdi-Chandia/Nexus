
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {SignupPage} from "./pages/Register.jsx";
import {LoginPage} from "./pages/Login.jsx";
import VerifyOTP from "./pages/verifyOTP.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import HomePage from "./pages/Home.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import CreateMeeting from "./meeting/CreateMeeting.jsx";
import InvestorDashboard from "./investorDashboard/InvestorDashboard.jsx";
import ChatPage from "./pages/Chat.jsx";
import Meeting from "./pages/Meeting.jsx";
import { ToastContainer } from 'react-toastify';
import VideoCall from "./pages/VideoCall.jsx";



function App() {

  return (
    <>
  <div className="">
    <BrowserRouter>
      <Routes>
        <Route path={"/"}  element={<HomePage/>}/>
        <Route path="/register" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path={"/verify-otp"} element={<VerifyOTP/>} />
        <Route path={"/forgot-password"} element={<ForgotPassword/>}/>
        <Route path={"/reset-password"} element={<ResetPassword/>}/>
        <Route path={"/dashboard"} element={<Dashboard/>}/>
        <Route path={"/investor-dashboard"} element={<InvestorDashboard/>} />
        <Route path={"/complete-profile"} element={<CompleteProfile/>} />
        <Route path={"/request-meeting/:id"} element={<CreateMeeting/>} />
        <Route path={"/messages/:meetingId"} element={<ChatPage/>} />
        <Route path={"/meeting/:meetingId"} element={<Meeting/>} />
        <Route path={"/video-call/:meetingId"} element={<VideoCall/>} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </div>
    </>
  )
}

export default App
