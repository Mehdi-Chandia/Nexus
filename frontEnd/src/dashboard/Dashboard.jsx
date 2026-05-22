import notifGif from "../../src/assets/notification.gif"
import chatGif from "../../src/assets/chat.gif"
import emailGif from "../../src/assets/email.gif"
import overviewGif from "../../src/assets/comic.png"
import meetingGif from "../../src/assets/meeting.gif"
import videoIcon from "../../src/assets/video.gif"
import investorIcon from "../../src/assets/investors.png"
import fileIcon from "../../src/assets/docs.gif"
import paymentIcon from "../../src/assets/payments.gif"
import transactionIcon from "../../src/assets/transactions.png"
import profileIcon from "../../src/assets/profile.gif"
import settingsIcon from "../../src/assets/setting.gif"
import friendsIcon from "../../src/assets/friends.png"
import walletIcon from "../../src/assets/wallet.png"
import crossIcon from "../../src/assets/cross.gif"
import questionIcon from "../../src/assets/question.png"
import graphIcon from "../../src/assets/graph.png"
import notificationIcon from "../../src/assets/notification.png"
import folderIcon from "../../src/assets/folder.gif"
import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const Dashboard=()=>{
    const [users,setUsers]=useState([])
    const [meetings,setMeetings]=useState([])
    const [notifications,setNotifications]=useState([])

    const navigate=useNavigate();
    const {user,isLoading}=useAuth();

    const logout=async ()=>{
        try {
            const response=await fetch("http://localhost:3000/api/auth/logout",{
                method:"GET",
                credentials:'include',
                headers: {
                    'Accept': 'application/json',
                }
            })

            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            alert("logout successfully")
            navigate("/login");

        }catch(e){
            console.log(e)
            alert(e.message)
        }
    }

    const getUsers=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/auth/get-all-users",{
                method:"GET",
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            const investors=res.users.filter(user=> user.role ==='investor')
            setUsers(investors)
            console.log(investors)
        }catch (err){
            console.log(err.message)
            alert(err.message)
        }
    }

    const getAllMeetings=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/meeting/all-meetings",{
                method:"GET",
                credentials:'include',
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if (!response.ok){
                throw new Error(res.message)
            }
            // console.log(res.meetings)
            setMeetings(res.meetings)
        }catch(e){
            console.log(e)
        }
    }

    const getAllNotifications=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/notification/getAllNotifications",{
                method:'GET',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            console.log('notifications',res)
        }catch (err){
            console.log(err.message)
        }
    }
    const acceptedMeetings=meetings.filter(m=> m.status === 'accepted')
    // console.log('meetings of logged in user at dashboard page ',meetings)
    // console.log(user);

    useEffect(()=>{
        if(!isLoading){
            if (!user){
                navigate("/login");
            }
        }
    },[user,isLoading])

    useEffect(()=>{
        getUsers()
        getAllMeetings()
        getAllNotifications()
    },[])

    const mainSection=[
        {id:'overview',title:'Overview',icon:overviewGif},
        {id:'notification',title:'Notification',icon:notifGif},
        {id:'chat',title:'Chat',icon:chatGif},
        {id:'meeting',title:'Meeting',icon:meetingGif},
    ]

    const collabSection=[
        {id:'investor',title:'Investor',icon:investorIcon},
        {id:'videoCall',title:'Video Call',icon:videoIcon},
        {id:'documents',title: 'Documents',icon: fileIcon}
    ]

    const financeSection=[
        {id:'payment',title:'Payment',icon:paymentIcon},
        {id:'transactions',title:'Transactions',icon:transactionIcon},
    ]

    const accountSection=[
        {id:'profile',title:'Profile',icon:profileIcon},
        {id:'settings',title:'Settings',icon:settingsIcon},
    ]

    if(isLoading){
        return (
            <div className="h-screen flex justify-center items-center w-full">
                <p className="font-bold text-violet-500">loading</p>
            </div>
        )
    }
    return(
        <>
        <div className="min-h-screen text-white">
            {/*navbar*/}
            <nav className="w-full h-24 bg-[#0A0F1A] flex justify-around items-center gap-4 border-b border-violet-600 ">
                <div className="flex items-center justify-center gap-1">
                    <p className="bg-white rounded-md text-violet-600 px-2 text-2xl font-bold">N</p>
                    <h2 className="text-3xl font-bold text-violet-600">Nexus</h2>
                </div>
                <div className="flex items-center gap-3">
                        <img className="invert hover:cursor-pointer" src={notifGif} alt="notificationGif" width={30} />
                    <img className="invert hover:cursor-pointer" src={chatGif} alt="chatGif" width={30} />
                    <div className="flex items-center gap-3 ml-4 border p-2 rounded-md">
                        <img className="invert" src={emailGif} alt="notificationEmail" width={26} />
                        <p className="text-sm ">{user?.email || 'eample@.com'}</p>
                    </div>
                    <img className="rounded-full" src={user?.profilePicture?.fileUrl} alt={'profilePicture'} width={30} />
                </div>
            </nav>
            {/*grid*/}
            <div className="grid grid-cols-[250px_1fr]">
                {/*section 1*/}
                <section className="bg-[#0A0F1A] border-violet-600 border-r">
                    {/*main */}
                    <div className="flex flex-col gap-3 p-2">
                        <p className="text-left font-medium ">Main</p>
                        {mainSection.map((item,index)=>{
                            return(
                                <div key={index} className="flex gap-2  p-1 hover:bg-slate-600 transition-all
                                duration-200 cursor-pointer rounded-md">
                                    <img className='invert' src={item.icon} alt={item.title} width={30} />
                                    <p className="text-gray-300 ">{item.title}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='h-0.5 bg-gray-300 w-[90%] mx-auto'></div>
                {/* collaboration*/}
                    <div className="flex flex-col gap-3 p-2">
                        <p className="text-left font-medium ">Collaboration</p>
                        {collabSection.map((item,index)=>{
                            return(
                                <div key={index} className="flex gap-2  p-1 hover:bg-slate-600 transition-all
                                duration-200 cursor-pointer rounded-md">
                                    <img className='invert' src={item.icon} alt={item.title} width={30} />
                                    <p className="text-gray-300 ">{item.title}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='h-0.5 bg-gray-300 w-[90%] mx-auto'></div>
                {/* finance*/}
                    <div className="flex flex-col gap-3 p-2">
                        <p className="text-left font-medium ">Finance</p>
                        {financeSection.map((item,index)=>{
                            return(
                                <div key={index} className="flex gap-2  p-1 hover:bg-slate-600 transition-all
                                duration-200 cursor-pointer rounded-md">
                                    <img className='invert' src={item.icon} alt={item.title} width={30} />
                                    <p className="text-gray-300 ">{item.title}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='h-0.5 bg-gray-300 w-[90%] mx-auto'></div>
                {/* accounts*/}
                    <div className="flex flex-col gap-3 p-2">
                        <p className="text-left font-medium ">Accounts</p>
                        {accountSection.map((item,index)=>{
                            return(
                                <div key={index} className="flex gap-2  p-1 hover:bg-slate-600 transition-all
                                duration-200 cursor-pointer rounded-md">
                                    <img className='invert' src={item.icon} alt={item.title} width={30} />
                                    <p className="text-gray-300 ">{item.title}</p>
                                </div>
                            )
                        })}
                        <button onClick={logout} className="px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-800
                         transition-all duration-200 ">LogOut</button>
                    </div>
                </section>
                {/*section 2 of grid*/}
                <section className="bg-[#0B0E14]">
                    {/*header*/}
                    <div className="flex justify-around items-center gap-4 p-4">
                       <div className="flex flex-col gap-2">
                           <h2 className="font-bold text-4xl ">Good morning, <span className="text-violet-500">{user?.username} </span></h2>
                           <p className="text-[#8B9DC3] text-sm">Here's what's happening on your Nexus dashboard today.</p>
                       </div>
                        <div className="text-center">
                            <button className="border border-[#1A2A4A] rounded-md p-3 hover:bg-gray-700 hover:border-[#00E5FF] transition-all duration-200">
                                <span className=" ">+</span> New Meeting</button>
                        </div>
                    </div>

                {/* cards*/}
                    <div className="flex justify-around items-center gap-4 p-4">
                        {/*1*/}
                        <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-green-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-green-400">
                            <div className="flex gap-2 justify-center items-center">
                               <img src={friendsIcon} alt="friends" className="invert" width={32}/>
                                <p className="bg-green-600 px-2 rounded-full text-sm">+12%</p>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-3xl font-bold text-green-600">45</h3>
                                <p className="text-[#8B9DC3] text-sm">Investor connections</p>
                            </div>
                        </div>
                        {/*2*/}
                        <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-gray-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-gray-400">
                            <div className="flex gap-2 justify-center items-center">
                                <img src={meetingGif} alt="meeting" className="invert" width={32}/>
                                <p className="bg-gray-500 px-2 rounded-full text-sm">3 Today</p>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-3xl font-bold text-gray-500">11</h3>
                                <p className="text-[#8B9DC3] text-sm">Scheduled meetings</p>
                            </div>
                        </div>
                    {/* 3*/}
                        <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-red-400">
                            <div className="flex gap-2 justify-center items-center">
                                <img src={fileIcon} alt="documents" className="invert" width={32}/>
                                <p className="bg-red-300 px-2 rounded-full text-sm">2 Pending</p>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-3xl font-bold text-red-300">7</h3>
                                <p className="text-[#8B9DC3] text-sm">Shared Documents</p>
                            </div>
                        </div>
                    {/* 4*/}
                        <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-yellow-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-yellow-400">
                            <div className="flex gap-2 justify-center items-center">
                                <img src={walletIcon} alt="wallet" className="invert" width={32}/>
                                <p className="bg-yellow-400 px-2 rounded-full text-sm">Active</p>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-3xl font-bold text-yellow-400"><span className="text-green-500">$</span>2.4K</h3>
                                <p className="text-[#8B9DC3] text-sm">Total wallet Balance</p>
                            </div>
                        </div>
                    </div>
                    {/*meeting and investor cards*/}
                    <div className="grid grid-cols-2 gap-4 p-3 ">
                        {/*header*/}
                        <div className="bg-gray-800 p-3 rounded-md">
                            <div className="flex justify-between items-center gap-2">
                                <img src={meetingGif} alt="meeting" className="invert" width={28}/>
                                <p className="text-2xl font-bold text-[#ffffff40]">Upcoming Meetings</p>
                                <p className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">see all</p>
                            </div>
                            <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                        {/* meetings list*/}
                            {acceptedMeetings.length > 0 ? (
                                acceptedMeetings.map((meeting) => {
                                    return (
                                        <div key={meeting._id} className="flex justify-between items-center gap-2 p-2">
                                            <div>
                                                <p className="text-sm text-blue-400">10Am</p>
                                                <p className="text-sm">Today</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Pitch Review Session</p>
                                                <p  className="text-sm text-gray-500">with Sarah Malik · VC Fund</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-400 ">video</p>
                                                <img src={videoIcon} alt="video" className="invert" width={28}/>
                                                <img src={crossIcon} alt="cross" className="invert" width={28}/>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (<p className="text-lg ml-16 text-gray-500 p-3 mt-4 ">No Meetings accepted yet! Schedule one.</p>)}
                            <div className="h-0.5 w-full bg-violet-600 mt-4"></div>
                        </div>
                        {/*investors lists*/}
                        <div className="bg-gray-800 p-3 rounded-md">
                            {/*header*/}
                            <div className="flex justify-between items-center gap-2">
                                <img src={questionIcon} alt="question" className="invert" width={28}/>
                                <p className="text-2xl font-bold text-[#ffffff40]">Find Investors</p>
                                <p className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">Browse all</p>
                            </div>
                            <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                            {users.slice(0,2).map((user, index) => (
                                <>
                                    <div key={user._id} className="flex justify-between items-center gap-2 p-4">
                                        <div>
                                            <p className="bg-violet-200 rounded-full p-2 text-violet-500">{user.username}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.companyName}</p>
                                            <p  className="text-sm text-gray-500">Industry of Interest {user.industryInterested}</p>
                                        </div>
                                        <div>
                                            <button onClick={()=> navigate(`/request-meeting/${user._id}`)} className="border border-gray-400 p-3 rounded-full
                                             hover:bg-gray-700 transition-all duration-200">Request Meeting</button>
                                        </div>
                                    </div>
                                </>
                            ))}
                            <div className="h-0.5 w-full bg-cyan-500 mt-4"></div>
                        </div>
                    </div>

                {/* Activities and documents cards*/}

                    <div className="grid grid-cols-2 gap-4 p-3 ">
                        {/*header*/}
                        <div className="bg-gray-800 p-3 rounded-md">
                            <div className="flex items-center gap-4">
                                <img src={graphIcon} alt="activities" className="invert" width={25}/>
                                <p className="text-2xl text-[#ffffff40] font-bold ">Recent Activity</p>
                            </div>
                            <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                            {/* activity list*/}
                            <div className="flex justify-between items-center gap-2 p-2">
                                <div>
                                   <img src={notificationIcon} alt="activities" className="invert" width={25}/>
                                </div>
                                <div>
                                    <p className="text-gray-400"> <span className="font-bold text-white">Sarah Malik</span> accepted your Meeting request.</p>
                                    <p  className="text-sm text-gray-500">3 Hours ago</p>
                                </div>
                            </div>
                            <div className="h-0.5 w-full bg-green-600 mt-4"></div>
                        </div>
                        {/*Documents lists*/}
                        <div className="bg-gray-800 p-3 rounded-md">
                            {/*header*/}
                            <div className="flex justify-between items-center gap-2">
                                <img src={folderIcon} alt="documents" className="invert" width={28}/>
                                <p className="text-2xl font-bold text-[#ffffff40]">Documents Chamber</p>
                                <p className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">see all</p>
                            </div>
                            <div className="h-0.5 w-full bg-gray-500 mt-4"></div>

                            <div className="flex justify-between items-center gap-2 p-4">
                                <div>
                                    <p className="bg-violet-200 rounded-full p-2 text-violet-500">
                                        <img src={fileIcon} alt={"file"} width={28} />
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Pitch Deck v3.pdf</p>
                                    <p  className="text-sm text-gray-500">Shared with Sarah · 2.1 MB</p>
                                </div>
                                <div>
                                    <p className="text-sm bg-yellow-200 rounded-full p-1 text-gray-700">under Review</p>
                                </div>
                            </div>
                            <div className="h-0.5 w-full bg-cyan-500 mt-4"></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        </>
    )
}
export default Dashboard;