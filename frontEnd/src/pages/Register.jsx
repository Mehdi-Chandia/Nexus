import { useForm } from "react-hook-form"
import {Link, useNavigate} from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import {API_URL} from "../lib/api.js";


export function SignupPage() {
    const {setUser}=useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigateTo = useNavigate();

        const {
            register,
            handleSubmit,
            watch,
            formState: { errors,isSubmitting },
        } = useForm()
        const onSubmit=async (data) =>{
            try {
                const response=await fetch(`${API_URL}/api/auth/register`,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                const res=await response.json()
                if (!response.ok){
                    throw new Error(res.message)
                }
                setUser(res.user)
                toast.success("user registered successfully")
                navigateTo("/complete-profile")

            }catch(err){
                console.log(err)
                toast.error(err.message)
            }
        }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-3">Create Account</h1>
                    <p className="text-slate-400 text-sm">
                        Join Nexus Platform and connect entrepreneurs with investors.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        {/*username*/}
                        <label className="block mb-2 text-sm text-slate-300">Username</label>
                        <input
                            {...register('username',
                                {required:{value:true,message:'Username is required'},
                                    minLength:{value:3,message:'Username must be atleast 3 characters'},
                                  maxLength:{value:15,message:'Username cannot be more than 15 characters'},
                                })}
                            type="text"
                            placeholder="Enter your username"
                            className="w-full bg-slate-800 border border-slate-700
                             rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
                    </div>

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
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            className="relative w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <span onClick={()=> setShowPassword(!showPassword)}  className="cursor-pointer absolute z-30 right-14 md:right-115 mt-4 mr-2">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>

                        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <div>
                        {/*role*/}
                        <label className="block mb-2 text-sm text-slate-300">Role</label>
                        <select
                            {...register('role',{required:{value:true,message:'Please select a role'}})}
                            className="w-full bg-slate-800 border border-slate-700
                             rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500">
                            <option value="">Select Role</option>
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="investor">Investor</option>
                        </select>
                        {errors.role && <p className="text-sm text-red-400">{errors.role.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w - full bg-violet-600 hover:bg-violet-700 transition rounded-xl p-4 py-3 
                        font-semibold ${isSubmitting ?'cursor-not-allowed opacity-40':''}`}
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link to={"/login"} className="text-violet-400 cursor-pointer hover:text-violet-300">
            Login
          </Link>
                </p>
            </div>
        </div>
    );
}