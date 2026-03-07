import api from "./api";

export const authService={
    // ? Register new user
    register: async(userData)=>{
        const response=await api.post(`/user/register`,userData);
        console.log(response.data)
        return response.data;
    },

    // ? Login user
    login:async(credentials)=>{
        const {data}=await api.post('/user/login',credentials);
        return data;
    },

    // ? logout user
    logout:async()=>{
        const response=await api.post('/user/logout');
        return response.data;
    },

    // ?  current user
    current:async()=>{
        const response=await api.get('/user/current');
        return response.data;
    },

    // ? update user profile
    updateProfile:async(userData)=>{
        const response=await api.patch('/user/update-profile',userData);
        return response.data;
    },

    // ? update password
    updatePassword:async(password)=>{
        const response=await api.patch('/user/update-password',password);
        return response.data;
    },

    // ? verify email
    emailVerify:async(emailToken)=>{
        const response= await api.get(`/user/verify-email`,{
            params:{emailToken}
        })
        return response.data;
    },

    // ? Resend email link
    resendEmailVerification:async(email)=>{
        const response=await api.post('/user/resend-email-link',email);
        return response.data;
    },

    // ? forgot password
    passwordForgot:async(email)=>{
        const response=await api.post('/user/forgot-password',email);
        return response.data;
    },

    // ? reset password 
    resetPassword:async(resetPasswordToken,password)=>{
        const response=await api.post('/user/reset-password',{
            params:{resetPasswordToken}
        },password)
        return response.data;
    }  
}