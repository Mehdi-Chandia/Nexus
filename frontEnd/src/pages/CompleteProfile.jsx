import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


const CompleteProfile = () => {
    const { isLoading, user } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // common fields
            formData.append("companyName", data.companyName);
            formData.append("bio", data.bio);
            formData.append("location", data.location);

            // entrepreneur fields
            if (user?.role === "entrepreneur") {
                formData.append("industry", data.industry);
                formData.append("fundingNeeded", data.fundingNeeded);
            }

            // investor fields
            if (user?.role === "investor") {
                formData.append(
                    "industryInterested",
                    data.industryInterested
                );

                formData.append(
                    "investmentMin",
                    data.investmentMin
                );

                formData.append(
                    "investmentMax",
                    data.investmentMax
                );
            }

            // profile picture
            if (data.profilePicture[0]) {
                formData.append(
                    "profilePicture",
                    data.profilePicture[0]
                );
            }

            const response = await fetch("http://localhost:3000/api/auth/complete-profile",{
                method: "POST",
                credentials:'include',
                headers: {
                    contentType: "multipart/form-data",
                },
                body: formData,
            })
            console.log(response.data);
            const res= await response.json();
            if (!response.ok){
                throw new Error(res.message || "Something went wrong");
            }
            toast.success("Your profile Completed Successfully!");
            navigate("/dashboard");

        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (!isLoading){
            if (!user){
                navigate("/register")
            }
        }
    }, [isLoading, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-gray-800">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Complete Profile
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Complete your {user?.role} profile
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    {/* COMPANY NAME */}
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Company Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter company name"
                            {...register("companyName", {
                                required: "Company name is required",
                            })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                        {errors.companyName && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.companyName.message}
                            </p>
                        )}
                    </div>

                    {/* BIO */}
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Bio
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Write your bio..."
                            {...register("bio", {
                                required: "Bio is required",
                            })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                        />

                        {errors.bio && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.bio.message}
                            </p>
                        )}
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="Enter location"
                            {...register("location", {
                                required: "Location is required",
                            })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                        {errors.location && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.location.message}
                            </p>
                        )}
                    </div>

                    {/* ENTREPRENEUR FIELDS */}
                    {user?.role === "entrepreneur" && (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Industry
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter industry"
                                    {...register("industry", {
                                        required: "Industry is required",
                                    })}
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                />

                                {errors.industry && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.industry.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Funding Needed
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter funding needed"
                                    {...register("fundingNeeded", {
                                        required:
                                            "Funding amount is required",
                                    })}
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                />

                                {errors.fundingNeeded && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {
                                            errors.fundingNeeded.message
                                        }
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* INVESTOR FIELDS */}
                    {user?.role === "investor" && (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Industry Interested
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter interested industry"
                                    {...register(
                                        "industryInterested",
                                        {
                                            required:
                                                "Industry interested is required",
                                        }
                                    )}
                                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                                {errors.industryInterested && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {
                                            errors
                                                .industryInterested
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Investment Minimum
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Minimum investment"
                                        {...register(
                                            "investmentMin",
                                            {
                                                required:
                                                    "Minimum investment required",
                                            }
                                        )}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                    {errors.investmentMin && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {
                                                errors
                                                    .investmentMin
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Investment Maximum
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Maximum investment"
                                        {...register(
                                            "investmentMax",
                                            {
                                                required:
                                                    "Maximum investment required",
                                            }
                                        )}
                                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                    {errors.investmentMax && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {
                                                errors
                                                    .investmentMax
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {/* PROFILE PICTURE */}
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            {...register("profilePicture",{required:'image is required'})}
                            className="w-full text-gray-300"
                        />
                        {errors.profilePicture && (
                            <p className="text-red-500 text-sm mt-2">
                                {
                                    errors
                                        .profilePicture
                                        .message
                                }
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300
                         text-white py-3 rounded-xl font-semibold ${isSubmitting ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                        Complete Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;