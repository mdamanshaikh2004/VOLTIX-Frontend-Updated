import {createContext,useContext,useEffect,useState} from 'react';import api from '../services/api';import {useAuth} from './AuthContext';
const C=createContext(null);
export function CartProvider({children}){const {isAuthenticated}=useAuth();const [cart,setCart]=useState({items:[],subtotal:0,discount:0,shipping:0,tax:0,total:0});const [loading,setLoading]=useState(false);
 const refresh=async()=>{if(!isAuthenticated){setCart({items:[],subtotal:0,discount:0,shipping:0,tax:0,total:0});return}setLoading(true);try{setCart((await api.get('/cart')).data.cart)}finally{setLoading(false)}};
 useEffect(()=>{refresh().catch(()=>{})},[isAuthenticated]);
 const add=async(productId,quantity=1)=>{const r=await api.post('/cart',{productId,quantity});setCart(r.data.cart);return r.data};
 const update=async(productId,quantity)=>{const r=await api.put(`/cart/${productId}`,{quantity});setCart(r.data.cart);return r.data};
 const remove=async id=>{const r=await api.delete(`/cart/${id}`);setCart(r.data.cart)};
 const clear=async()=>{const r=await api.delete('/cart');setCart(r.data.cart)};
 return <C.Provider value={{cart,loading,refresh,add,update,remove,clear,count:cart.items.length,quantityCount:cart.items.reduce((s,i)=>s+i.quantity,0)}}>{children}</C.Provider>}
export const useCart=()=>useContext(C);
