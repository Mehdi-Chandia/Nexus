import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {SignupPage} from "./pages/Register.jsx";
import {LoginPage} from "./pages/Login.jsx";
import VerifyOTP from "./pages/verifyOTP.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import HomePage from "./pages/Home.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";



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
      </Routes>
    </BrowserRouter>
  </div>
    </>
  )
}

export default App
