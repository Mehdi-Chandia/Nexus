import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useAuth} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import {API_URL} from "../lib/api.js";

const CreateMeeting = () => {
    const {id} = useParams();
    console.log('investor id ',id);

    const {isLoading,user}=useAuth();
    const navigateTo = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
    } = useForm()
    const onSubmit=async (data) =>{
        console.log(data)
        const response=await fetch(`${API_URL}/api/meeting/request-meeting/${id}`,{
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data),
        })
        const result=await response.json();
        if(!response.ok){
            throw new Error(result.message)
        }
        toast.success(result.message)
        navigateTo("/dashboard")
    }

    useEffect(()=>{
        if (!isLoading){
            if (!user){
                navigateTo('/login')
            }
        }
    },[isLoading,user])

    if(isLoading){
        return (
            <div className="h-screen flex justify-center items-center w-full">
                <p className="font-bold text-violet-500">loading</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl bg-[#1e293b] border border-gray-800 rounded-2xl shadow-2xl p-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Schedule Meeting
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Create a meeting request with investor or entrepreneur
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* AGENDA */}
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                            Meeting Agenda
                        </label>

                        <textarea
                            {...register('agenda',{required:{value:true,message:"Please enter agenda"}})}
                            rows={5}
                            placeholder="Enter meeting agenda..."
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 resize-none transition-all"
                        />
                        {errors.agenda && <p className="text-sm text-red-400">{errors.agenda.message}</p>}
                    </div>

                    {/* START TIME */}
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                            Start Time
                        </label>

                        <input
                            {...register('startTime',{required:{value:true,message:"Please enter start time"}})}
                            type="datetime-local"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                        />
                        {errors.startTime && <p className="text-sm text-red-400">{errors.startTime.message}</p>}
                    </div>

                    {/* END TIME */}
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">
                            End Time
                        </label>

                        <input
                            {...register('endTime',{required:{value:true,message:"Please enter end time"}})}
                            type="datetime-local"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                        />
                        {errors.endTime && <p className="text-sm text-red-400">{errors.endTime.message}</p>}
                    </div>

                    {/* INFO CARD */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-2">
                            Meeting Guidelines
                        </h3>

                        <ul className="text-gray-400 text-sm space-y-2">
                            <li>
                                • Make sure your agenda is clear and concise
                            </li>

                            <li>
                                • Avoid scheduling duplicate meetings
                            </li>

                            <li>
                                • Choose a suitable meeting duration
                            </li>

                            <li>
                                • The other user will receive a meeting request notification
                            </li>
                        </ul>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">

                        <button
                            type="submit"
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl 
                            font-semibold transition-all duration-300 ${isSubmitting ? 'cursor-not-allowed opacity-40':''}`}
                        >
                            Send Meeting Request
                        </button>

                        <button
                            type="button"
                            className="flex-1 bg-[#0f172a] border border-gray-700 hover:border-gray-500 text-gray-300 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateMeeting;