import {createContext,useContext,useEffect,useState} from 'react';
import api from '../services/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('voltix_user'))}catch{return null}});
 const [loading,setLoading]=useState(true);
 const save=(u,t)=>{if(t)localStorage.setItem('voltix_token',t);if(u)localStorage.setItem('voltix_user',JSON.stringify(u));setUser(u)};
 useEffect(()=>{const token=localStorage.getItem('voltix_token');if(!token){setUser(null);setLoading(false);return;}api.get('/auth/me').then(r=>save(r.data.user)).catch(()=>{localStorage.removeItem('voltix_token');localStorage.removeItem('voltix_user');setUser(null)}).finally(()=>setLoading(false))},[]);
 const login=async(data)=>{const r=await api.post('/auth/login',data);save(r.data.user,r.data.token);return r.data};
 const register=async(data)=>{const r=await api.post('/auth/register',data);return r.data};
 const logout=()=>{localStorage.removeItem('voltix_token');localStorage.removeItem('voltix_user');setUser(null)};
 return <AuthContext.Provider value={{user,loading,login,register,logout,isAuthenticated:!loading&&!!user,isAdmin:!loading&&user?.role==='admin'}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
