import { Link } from "react-router-dom";
import { FaRocket, FaUsers, FaChartLine, FaHandshake } from "react-icons/fa";
import {motion} from "framer-motion";

const HomePage = () => {

    return (
        <div className="min-h-screen bg-[#060B14] text-white flex flex-col items-center px-6">

            {/* Hero section */}
            <div className="flex flex-col justify-center items-center text-center py-24">

                <motion.div
                    initial={{opacity:0,y:100}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:1,delay:0.5}}

                    className="flex items-center gap-3 mb-6">
                    <p className="bg-cyan-400 text-[#060B14] text-4xl font-bold px-4 py-2 rounded-xl">N</p>
                    <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                        Nexus
                    </h1>
                </motion.div>

                <motion.h2
                    initial={{opacity:0, y:-100}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:1,delay:0.8}}

                    className="text-2xl md:text-4xl font-bold mb-4">
                    Empowering Startup Growth Through Meaningful Connections
                </motion.h2>

                <motion.p
                    initial={{opacity:0,y:100}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:1, delay:1}}

                    className="text-gray-400 max-w-[750px] text-sm md:text-lg leading-7">
                    Nexus brings entrepreneurs and investors together in one smart ecosystem.
                    Discover startups, schedule meetings, collaborate in real time,
                    and turn innovative ideas into successful ventures.
                </motion.p>

                <div className="flex gap-4 mt-8">
                    <Link
                        to="/login"
                        className="bg-cyan-500 px-8 py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all duration-300"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="border border-violet-500 px-8 py-3 rounded-xl font-bold hover:bg-violet-600 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>

            </div>

            <div className="">
                <Link
                    to="/dashboard"
                    className="border border-violet-500 px-8 py-3 rounded-xl font-bold hover:bg-violet-600 transition-all duration-300"
                >
                    Dashboard
                </Link>
            </div>


            {/* Features */}
            <div className="w-full max-w-7xl py-10">

                <h2 className="text-3xl font-bold text-center text-cyan-400 mb-12">
                    Why Choose Nexus?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-cyan-700 hover:scale-105 transition-all duration-300">
                        <FaRocket size={35} className="text-cyan-400 mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Startup Discovery
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Explore innovative startups and discover opportunities with high potential.
                        </p>
                    </div>

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-violet-700 hover:scale-105 transition-all duration-300">
                        <FaHandshake size={35} className="text-violet-400 mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Smart Collaboration
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Connect entrepreneurs and investors through meetings and communication tools.
                        </p>
                    </div>

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-cyan-700 hover:scale-105 transition-all duration-300">
                        <FaUsers size={35} className="text-cyan-400 mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Community Growth
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Build relationships and grow within a network of ambitious creators.
                        </p>
                    </div>

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-violet-700 hover:scale-105 transition-all duration-300">
                        <FaChartLine size={35} className="text-violet-400 mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Investment Tracking
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Monitor investments and track startup performance with ease.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    )

}

export default HomePage