import axios from 'axios';

const api=axios.create({
    baseURL:import.meta.env.REACT_APP_API_URL || "http://localhost:9000/api",
    headers:{
        'Content-Type':'application/json',
    },
    withCredentials:true
});

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            window.location.href='/login';
        }

        if(error.response?.status===403){
            console.log("Access Denied");
        }

        if(error.response?.status>=500){
            console.log('Server error occurred');
        }

        return Promise.reject(error);
    }
)

export default api;