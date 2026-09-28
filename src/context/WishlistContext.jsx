import {createContext,useContext,useEffect,useState} from 'react';import api from '../services/api';import {useAuth} from './AuthContext';
const C=createContext(null);export function WishlistProvider({children}){const {isAuthenticated}=useAuth();const [items,setItems]=useState([]);
 const refresh=async()=>{if(!isAuthenticated){setItems([]);return}try{setItems((await api.get('/wishlist')).data.wishlist||[])}catch{} };useEffect(()=>{refresh()},[isAuthenticated]);
 const add=async id=>{const r=await api.post(`/wishlist/${id}`);setItems(r.data.wishlist||[])};const remove=async id=>{const r=await api.delete(`/wishlist/${id}`);setItems(r.data.wishlist||[])};const move=async id=>{await api.post(`/wishlist/${id}/move-to-cart`);setItems(x=>x.filter(p=>p._id!==id))};
 const has=id=>items.some(p=>p._id===id);return <C.Provider value={{items,add,remove,move,has,refresh}}>{children}</C.Provider>}
export const useWishlist=()=>useContext(C);
