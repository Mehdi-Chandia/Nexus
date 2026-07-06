import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify';
import Footer from "./components/Footer.jsx";

const SignupPage = lazy(() => import("./pages/Register.jsx").then(m => ({ default: m.SignupPage })));
const LoginPage = lazy(() => import("./pages/Login.jsx").then(m => ({ default: m.LoginPage })));
const VerifyOTP = lazy(() => import("./pages/verifyOTP.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const HomePage = lazy(() => import("./pages/Home.jsx"));
const Dashboard = lazy(() => import("./dashboard/Dashboard.jsx"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile.jsx"));
const CreateMeeting = lazy(() => import("./meeting/CreateMeeting.jsx"));
const InvestorDashboard = lazy(() => import("./investorDashboard/InvestorDashboard.jsx"));
const ChatPage = lazy(() => import("./pages/Chat.jsx"));
const Meeting = lazy(() => import("./pages/Meeting.jsx"));
const VideoCall = lazy(() => import("./pages/VideoCall.jsx"));
const PaymentCancel = lazy(() => import("./stripePages/PaymentCancel.jsx"));
const PaymentSuccess = lazy(() => import("./stripePages/PaymentSuccess.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/login", "/register"];

  return (
      <>
        <Suspense fallback={<div style={{padding: "2rem", textAlign: "center"}}>Loading...</div>}>
          <Routes>
            <Route path={"/"} element={<HomePage />} />
            <Route path={"/register"} element={<SignupPage />} />
            <Route path={"/login"} element={<LoginPage />} />
            <Route path={"/verify-otp"} element={<VerifyOTP />} />
            <Route path={"/forgot-password"} element={<ForgotPassword />} />
            <Route path={"/reset-password"} element={<ResetPassword />} />
            <Route path={"/dashboard"} element={<Dashboard />} />
            <Route path={"/investor-dashboard"} element={<InvestorDashboard />} />
            <Route path={"/complete-profile"} element={<CompleteProfile />} />
            <Route path={"/request-meeting/:id"} element={<CreateMeeting />} />
            <Route path={"/messages/:meetingId"} element={<ChatPage />} />
            <Route path={"/meeting/:meetingId"} element={<Meeting />} />
            <Route path={"/video-call/:meetingId"} element={<VideoCall />} />
            <Route path={"/payment-success"} element={<PaymentSuccess />} />
            <Route path={"/payment-cancel"} element={<PaymentCancel />} />
            <Route path={"/about"} element={<About />} />
            <Route path={"/contact"} element={<Contact />} />
          </Routes>
        </Suspense>

        {!hideFooter.includes(location.pathname) && <Footer />}
      </>
  );
}

function App() {
  return (
      <div className="min-h-screen bg-[#060B14] text-white">
        <BrowserRouter>
          <AppContent />
          <ToastContainer />
        </BrowserRouter>
      </div>
  );
}

export default App;