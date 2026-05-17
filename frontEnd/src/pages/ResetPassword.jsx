import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {token}=useParams();
    console.log("reset password token ",token);

    const navigateTo = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors,isSubmitting },
    } = useForm()
    const onSubmit=async (data) =>{
        console.log(data)
        if (data.password !== data.confirmPassword){
            setError("confirmPassword",{
                type:'manual',
                message:"Passwords don't match",
            })
            return;
        }
        try {
            const response=await fetch(`http://localhost:3000/api/auth/reset-password/${token}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(data),
            })
            const res=await response.json();
            if (!response.ok){
                throw new Error(res.message)
            }
            alert("Password reset successfully")
            navigateTo("/login")

        }catch(err){
            console.log(err)
            alert(err.message)
        }
    }

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-white mb-3">
                        Reset Password
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        Create a new secure password for your account.
                    </p>

                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>

                        <label className="block text-sm text-slate-300 mb-2">
                            New Password
                        </label>

                        <input
                            {...register("password",{required:{value:true,message:"Please enter new password"},
                            minLength:{value:6,message:"Please enter minimum 6 characters"},
                                maxLength:{value:12,message:"Please enter maximum 12 characters"},
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <span onClick={()=> setShowPassword(!showPassword)}  className="cursor-pointer absolute z-30 right-115 invert mt-4 mr-2">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <div>

                        <label className="block text-sm text-slate-300 mb-2">
                            Confirm Password
                        </label>

                        <input
                            {...register("confirmPassword",{required:{value:true,message:"Please enter new password"},
                                minLength:{value:6,message:"Please enter minimum 6 characters"},
                                maxLength:{value:12,message:"Please enter maximum 12 characters"},
                            })}
                            type={ showPasswordConfirm ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <span onClick={()=> setShowPasswordConfirm(!showPasswordConfirm)}  className="cursor-pointer absolute z-30 right-115 invert mt-4 mr-2">
                            {showPasswordConfirm ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-violet-600 hover:bg-violet-700
                         transition-all duration-300 text-white py-3 rounded-xl
                          font-semibold ${isSubmitting ? 'cursor-not-allowed opacity-40' :''}`}
                    >
                        Reset Password
                    </button>

                </form>

                <div className="mt-6 text-center">

                    <p className="text-slate-400 text-sm">
                        Remembered your password?{" "}

                        <span onClick={()=> navigateTo("/login")} className="text-violet-400 hover:text-violet-300 cursor-pointer transition">
                            Back to Login
                        </span>

                    </p>

                </div>

            </div>

        </div>
    )
}

export default ResetPassword;