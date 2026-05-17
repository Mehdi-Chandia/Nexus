import {useForm} from "react-hook-form";
import {useState} from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";

export function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigateTo = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,submitting },
    } = useForm()
    const onSubmit=async (data) =>{
        try {
            setLoading(true);
            const response=await fetch("http://localhost:3000/api/auth/login",{
                method:"POST",
                credentials:'include',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            })
            const res=await response.json()
            if (!response.ok){
                throw new Error(res.message)
            }
            alert("user loggedIn successfully")
            navigateTo("/verify-otp",{
                state:{
                    email:res.email,
                }
            })

        }catch(err){
            console.log(err)
            alert(err.message)
        }finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-3">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">
                        Login to continue managing meetings and collaborations.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        {/*email*/}
                        <label className="block mb-2 text-sm text-slate-300">Email</label>
                        <input
                            {...register('email',{required:{value:true,message:'Email is required'}})}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        {/*password*/}
                        <label className="block mb-2 text-sm text-slate-300">Password</label>
                        <input
                            {...register('password',
                                {required:{value:true,message:'password is required'},
                                    minLength:{value:3,message:'password must be atleast 6 characters'},
                                    maxLength:{value:15,message:'password cannot be more than 15 characters'},
                                })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <span onClick={()=> setShowPassword(!showPassword)}  className="cursor-pointer absolute z-30 right-115 invert mt-4 mr-2">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-400">
                            <input type="checkbox" className="accent-violet-500" />
                            Remember me
                        </label>

                        <button onClick={()=> navigateTo("/forgot-password")}
                            type="button"
                            className="text-violet-400 hover:text-violet-300 transition"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-violet-600 hover:bg-violet-700
                         transition rounded-xl py-3 font-semibold ${loading ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to={"/register"} className="text-violet-400 cursor-pointer hover:text-violet-300">
            Sign Up
          </Link>
                </p>
            </div>
        </div>
    );
}


