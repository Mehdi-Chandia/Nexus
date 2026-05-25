import { io } from "socket.io-client";
import {useEffect} from "react";


const socket = io("http://localhost:3000", {
    withCredentials: true,
});

export default socket;