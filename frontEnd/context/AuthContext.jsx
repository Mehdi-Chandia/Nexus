import {createContext, useContext, useEffect, useState} from "react";
import {API_URL} from "../src/lib/api.js";


const AuthContext= createContext()

export const AuthProvider=({children}) => {

    const [isLoading,setIsLoading]=useState(true)
    const [user,setUser]=useState(null)

    const fetchProfile=async()=>{
        setIsLoading(true)
        try {
            const response=await fetch(`${API_URL}/api/auth/get-me`,{
                method:"GET",
                credentials:'include',
                headers:{
                    'Accept': 'application/json',
                }
            })
            if (response.status === 401){
                setIsLoading(false)
                setUser(null)
                throw new Error('user is not logged in')
            }
            const data=await response.json();
            if (!response.ok){
                throw new Error(data.message)
            }
            // console.log('user in auth context',data.user)
            setUser(data.user)
        }catch (err){
            console.log(err.message)
            // alert(err.message)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchProfile();

    },[])


    return(
        <AuthContext.Provider value={{user, isLoading,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    const context=useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within auth provider')
    }
    return context;
}