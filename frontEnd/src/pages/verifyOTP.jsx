import {useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";


const VerifyOTP= () => {
    const {setUser}=useAuth();
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const navigateTo = useNavigate();
    const location = useLocation();
    const email = location?.state?.email;
    console.log(email);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,submitting },
    } = useForm()
    const onSubmit=async (data) =>{
        // console.log(data)
        try {
            setLoading(true);
            const response=await fetch("http://localhost:3000/api/auth/verify-otp",{
                method:"POST",
                credentials:'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otpCode:data.otp
                }),
            })

            const result=await response.json();
            if (!response.ok){
                throw new Error( result.message || "Failed to verify otp");
            }
            setUser(result.user);
            navigateTo("/dashboard");
        }catch(err){
            console.log(err)
            alert(err.message)
        }finally {
            setLoading(false);
        }
    }

    const resendOTP=async ()=>{
        try {
            setLoading(true);
            const response=await fetch("http://localhost:3000/api/auth/resend-otp",{
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                })
            })
            const result=await response.json();
            if (!response.ok){
                throw new Error( result.message || "Failed to resend otp");
            }
            alert("OTP resend successfully");
            setTimer(60)
        }catch(err){
            console.log(err)
            alert(err.message)
        }finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(timer <= 0) return;
        const interval = setInterval(()=>{
            setTimer(prev=> prev-1)
        },1000)
        return () => {
            clearInterval(interval)
        }
    },[timer])

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-white mb-3">
                        Verify OTP
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        We have sent a 6-digit verification code to your email.
                        Enter the code below to continue login.
                    </p>

                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>

                        <label className="block text-sm text-slate-300 mb-2">
                            OTP Code
                        </label>

                        <input
                            {...register('otp',{required:{value:true,message:"Otp is required"},
                            minLength:{value:6, message:"Minimum 6 digits"},
                                maxLength:{value:6, message:"Maximum 6 digits"},
                            })}
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        {errors.otp && <p className="text-sm text-red-400">{errors.otp.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-violet-600 hover:bg-violet-700 
                        transition-all duration-300 text-white py-3 rounded-xl
                         font-semibold ${loading ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                        Verify OTP
                    </button>

                </form>

                <div className="mt-6 text-center">

                    <p className="text-slate-400 text-sm mb-3">
                        Didn&apos;t receive the code?
                    </p>

                    <button
                        disabled={timer > 0}
                        onClick={resendOTP}
                        type="button"
                        className={`text-violet-400 hover:text-violet-300 text-sm 
                        font-medium transition ${loading ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                        {timer ? `resend in ${timer}s`: ' Resend OTP'}
                    </button>

                </div>

            </div>

        </div>
    )
}

export default VerifyOTP;