import axios from 'axios';

const api=axios.create({
 baseURL:import.meta.env.VITE_API_URL||'/api',
 headers:{'Content-Type':'application/json'},
 timeout:15000,
});

api.interceptors.request.use(config=>{
 const token=localStorage.getItem('voltix_token');
 if(token)config.headers.Authorization=`Bearer ${token}`;
 return config;
});

api.interceptors.response.use(
 r=>r,
 e=>{
  if(e.response?.status===401){
   localStorage.removeItem('voltix_token');
   localStorage.removeItem('voltix_user');
  }
  return Promise.reject(e);
 }
);

export default api;
