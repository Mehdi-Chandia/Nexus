import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#060B14] text-white px-6 py-16">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-6">
                    Contact Nexus
                </h1>

                <p className="text-gray-400 text-center mb-14">
                    Have questions or ideas? Reach out to us.
                </p>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Contact info */}
                    <div className="bg-[#0D1626] border border-cyan-800 rounded-2xl p-8 space-y-8">

                        <div className="flex gap-4 items-center">
                            <FaEnvelope className="text-cyan-400 text-xl"/>
                            <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-gray-400">support@nexus.com</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <FaPhone className="text-violet-400 text-xl"/>
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p className="text-gray-400">+92 300 0000000</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <FaMapMarkerAlt className="text-cyan-400 text-xl"/>
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-gray-400">Pakistan</p>
                            </div>
                        </div>

                    </div>

                    {/* Form */}
                    <div className="bg-[#0D1626] border border-violet-800 rounded-2xl p-8">

                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 rounded-lg bg-[#152238] border border-gray-700 outline-none focus:border-cyan-400"
                            />

                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-3 rounded-lg bg-[#152238] border border-gray-700 outline-none focus:border-cyan-400"
                            />

                            <textarea
                                rows="5"
                                placeholder="Message..."
                                className="w-full p-3 rounded-lg bg-[#152238] border border-gray-700 outline-none focus:border-cyan-400"
                            />

                            <button
                                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 py-3 rounded-lg font-bold hover:scale-[1.02] transition-all duration-300"
                            >
                                Send Message
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Contact;


