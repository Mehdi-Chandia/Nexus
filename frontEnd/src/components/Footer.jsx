import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#0D1626] border-t border-cyan-900 mt-10">

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Logo + Name */}
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                        Nexus
                    </h2>

                    <p className="text-violet-300 text-sm mt-2">
                        Fueling Startups, <span className="font-bold text-violet-500">Empowering</span> Innovation
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-6 text-gray-300 text-sm">
                    <Link to="/" className="hover:text-cyan-400 transition-all duration-200">
                        Home
                    </Link>

                    <Link to="/about" className="hover:text-purple-400 transition-all duration-200">
                        About
                    </Link>

                    <Link to="/contact" className="hover:text-cyan-400 transition-all duration-200">
                        Contact
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-5">

                    <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300"
                    >
                        <FaGithub size={24}/>
                    </a>

                    <a
                        href="https://linkedin.com/in/yourusername"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-purple-400 hover:scale-110 transition-all duration-300"
                    >
                        <FaLinkedin size={24}/>
                    </a>

                    <a
                        href="https://instagram.com/yourusername"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-all duration-300"
                    >
                        <FaInstagram size={24}/>
                    </a>

                </div>

            </div>

            <div className="h-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"></div>

            <div className="text-center py-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} Nexus • Built with passion
            </div>

        </footer>
    );
};

export default Footer;