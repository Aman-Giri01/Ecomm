// // import axios from 'axios';

// // const api=axios.create({
// //     baseURL:import.meta.env.REACT_APP_API_URL || "http://localhost:9000/api",
// //     headers:{
// //         'Content-Type':'application/json',
// //     },
// //     withCredentials:true
// // });

// // api.interceptors.response.use(
// //     (response)=>response,
// //     (error)=>{
// //         if(error.response?.status===401){
// //             window.location.href='/login';
// //         }

// //         if(error.response?.status===403){
// //             console.log("Access Denied");
// //         }

// //         if(error.response?.status>=500){
// //             console.log('Server error occurred');
// //         }

// //         return Promise.reject(error);
// //     }
// // )

// // export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000/api",
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // ❌ REMOVED: window.location.href = '/login' on 401
//     // That caused an infinite loop because:
//     // 1. loadUser() calls /api/user/current
//     // 2. If not logged in → 401
//     // 3. Interceptor redirects to /login
//     // 4. Page reloads → loadUser() runs again → repeat forever

//     // Just reject the error and let each service/context handle it
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000/api",
  // ✅ FIX: Do NOT set Content-Type here globally.
  // For JSON requests axios sets it automatically.
  // For FormData requests axios must auto-set multipart/form-data with boundary.
  // Hardcoding 'application/json' here breaks all FormData/file uploads.
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;