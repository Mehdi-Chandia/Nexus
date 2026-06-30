import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";

const Meeting=()=>{
    const {meetingId}=useParams();
    console.log(meetingId);

    const [meetingData, setMeetingData] = useState({})
    const [meetingDocs,setMeetingDocs] = useState([])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
    } = useForm()
    const onSubmit=async (data) =>{

        const formData=new FormData();
        formData.append("documentType",data.documentType);
        formData.append("file",data.file[0]);

        // console.log(data)
        try {
            const res=await fetch(`http://localhost:3000/api/document/upload/${meetingId}`,{
                method:"POST",
                credentials:'include',
                body:formData,
            })
            const respone = await res.json()
            if (!res.ok){
                throw new Error(respone.message)
            }
            console.log(respone)
           await fetchDocuments();
        }catch(error){
            console.log(error.message)
        }
    }


    const fetchDocuments=async () => {
        try {
            const response=await fetch(`http://localhost:3000/api/document/get-docs/${meetingId}`, {
                method: "GET",
                credentials:'include',
                headers: {'Content-Type': 'application/json'}
            })

            const data=await response.json();
            if (!response.ok) {
                throw new Error(`Failed to fetch document with id ${meetingId}`)
            }

            console.log(data)
            setMeetingDocs(data.documents)
        }catch(e){
            console.log(e.message)
        }
    }

    const fetchMeeting=async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/meeting/single-meeting/${meetingId}`, {
                method:"GET",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log('meeting data',data.meeting);
            setMeetingData(data.meeting)
        }catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        fetchDocuments();
        fetchMeeting();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white p-6">

            {/* Meeting Info */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800 mb-6">

                <h1 className="text-3xl font-bold mb-4">
                    Meeting Details
                </h1>

                <div className="space-y-3">

                    <p>
                    <span className="font-semibold text-violet-400">
                        Agenda:
                    </span>{" "}
                        {meetingData?.agenda}
                    </p>

                    <p>
                    <span className="font-semibold text-violet-400">
                        Status:
                    </span>{" "}
                        {meetingData?.status}
                    </p>

                    <p>
                    <span className="font-semibold text-violet-400">
                        Entrepreneur:
                    </span>{" "}
                        {meetingData?.entrepreneurId?.username}
                    </p>

                    <p>
                    <span className="font-semibold text-violet-400">
                        Investor:
                    </span>{" "}
                        {meetingData?.investorId?.username}
                    </p>

                    <p>
                    <span className="font-semibold text-violet-400">
                        Start Time:
                    </span>{" "}
                        {meetingData?.startTime &&
                            new Date(meetingData.startTime).toLocaleString()}
                    </p>

                    <p>
                    <span className="font-semibold text-violet-400">
                        End Time:
                    </span>{" "}
                        {meetingData?.endTime &&
                            new Date(meetingData.endTime).toLocaleString()}
                    </p>

                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">

                <h2 className="text-2xl font-bold mb-6">
                    Documents
                </h2>

                {/* Upload Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-[#1F2937] p-4 rounded-lg border border-gray-700 mb-6">

                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            {...register("documentType",{required:{value:true, message:"Document Type is required"}})}
                            type="text"
                            placeholder="Document Type (Pitch Deck, Proposal...)"
                            className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
                        />
                        {errors.documentType && <p className="text-sm text-red-400">{errors.documentType.message}</p>}
                        <input
                            {...register("file",{required:{value:true, message:"File is required"}})}
                            type="file"
                            className="bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-violet-500"
                        />
                        {errors.file && <p className="text-sm text-red-400">{errors.file.message}</p>}
                        <button  type={"submit"}
                            className={`bg-violet-600 hover:bg-violet-700 rounded-lg px-4 py-3 font-semibold ${isSubmitting ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                            Upload Document
                        </button>

                    </div>

                </div>
                </form>

                {meetingDocs.length === 0 ? (

                    <div className="text-center py-10 text-gray-400">
                        No documents uploaded yet.
                    </div>

                ) : (

                    <div className="space-y-4">

                        {meetingDocs.map((doc) => (

                            <div
                                key={doc._id}
                                className="bg-[#1F2937] p-4 rounded-lg border border-gray-700 flex items-center justify-between"
                            >

                                <div>
                                    <h3 className="font-semibold">
                                        {doc.documentType || doc.fileName}
                                    </h3>

                                    <p className="text-sm text-gray-400">
                                        Uploaded{" "}
                                        {doc.createdAt
                                            ? new Date(doc.createdAt).toLocaleString()
                                            : ""}
                                    </p>
                                </div>

                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                                >
                                    Open Document
                                </a>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            <Link className="text-gray-400 hover:text-blue-400 text-center text-sm mt-4" to={"/dashboard"}>Back to Dashboard</Link>

        </div>
    );
}
export default Meeting;