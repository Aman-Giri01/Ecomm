import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const AuthContext=createContext();

export const UseAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within ThemeProvider')
    }

    return context;
}

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    // const loadUser=async()=>{
    //     try {
    //         setLoading(true);
    //         const response=await authService.current();
    //         setUser(response.payload);
    //     } catch (error) {
    //         console.error('Auth check error:', error);
    //         setUser(null);
    //     }finally{
    //         setLoading(false);
    //     }
    // }
    // useEffect(()=>{
    //     loadUser();
    // },[]);

    // ~ Register function
    const register=async(userData)=>{
        try {
            setError(null);
            setLoading(true);
            const response=await authService.register(userData);
            setUser(response.payload);
            return {success:true}
        } catch (error) {
            const errorMsg=error.response?.data?.message || "Registration Failed";
            setError(errorMsg);
            return {success:false, error:errorMsg};
        }
    }

    // ~ Login
    const login=async(credentials)=>{
        try {
            setError(null);
            setLoading(true);
            const response=await authService.login(credentials);
            setUser(response.payload);

            toast.success(response.message || 'Login successfully');
            return {success:true,data:response}

            
        } catch (error) {
            const errorMsg=error.response?.data?.message || "Login Failed";
            setError(errorMsg);
            toast.error(errorMsg);
            return {success:false,error:errorMsg}
        }finally{
            setLoading(false);
        }
    }

    const value={
        register,
        login
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

