
import { FaRocket, FaHandshake, FaUsers } from "react-icons/fa";

const About = () => {
    return (
        <div className="min-h-screen bg-[#060B14] text-white px-6 py-16">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-6">
                    About Nexus
                </h1>

                <p className="text-gray-400 text-center max-w-3xl mx-auto leading-8 mb-16">
                    Nexus is a platform designed to connect visionary entrepreneurs
                    with ambitious investors. We simplify collaboration through
                    meetings, communication tools, investment tracking, and startup discovery.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-cyan-800">
                        <FaRocket className="text-cyan-400 text-3xl mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Innovation
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Helping startups transform ideas into impactful businesses.
                        </p>
                    </div>

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-violet-800">
                        <FaHandshake className="text-violet-400 text-3xl mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Collaboration
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Creating meaningful connections between entrepreneurs and investors.
                        </p>
                    </div>

                    <div className="bg-[#0D1626] p-6 rounded-2xl border border-cyan-800">
                        <FaUsers className="text-cyan-400 text-3xl mb-4"/>
                        <h3 className="font-bold text-xl mb-2">
                            Community
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Building a growing ecosystem of innovators and leaders.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default About;