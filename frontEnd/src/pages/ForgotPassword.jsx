import {useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {API_URL} from "../lib/api.js";

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
    } = useForm()
    const onSubmit=async (data) =>{
        try {
            const response=await fetch(`${API_URL}/api/auth/forgot-password`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const res=await response.json()
            if (!response.ok){
                throw new Error(res.message)
            }
            toast.info("Reset Link is sent to your email address")
            navigateTo("/")
        }catch (error) {
            console.log(error);
            alert(error.message)
        }
    }

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-white mb-3">
                        Forgot Password
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        Enter your email address and we&apos;ll send you a password reset link.
                    </p>

                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>

                        <label className="block text-sm text-slate-300 mb-2">
                            Email Address
                        </label>

                        <input
                            {...register('email',{required:{value:true,message:'Email is required'}})}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold"
                    >
                        Send Reset Link
                    </button>

                </form>

                <div className="mt-6 text-center">

                    <p className="text-slate-400 text-sm">
                        Remember your password?{" "}

                        <span onClick={()=> navigateTo("/login")} className="text-violet-400 hover:text-violet-300 cursor-pointer transition">
                            Back to Login
                        </span>

                    </p>

                </div>

            </div>

        </div>
    )
}

export default ForgotPassword;