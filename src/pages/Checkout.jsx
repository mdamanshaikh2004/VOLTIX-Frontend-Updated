import {useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {useCart} from '../context/CartContext';
import {money,errorMessage} from '../utils/helpers';
import EmptyState from '../components/EmptyState';

const initial={fullName:'',phone:'',address:'',city:'',state:'',postalCode:'',country:'India'};
const validators={
 fullName:v=>v.trim().length>=2?'':'Enter your full name.',
 phone:v=>/^[6-9]\d{9}$/.test(v.replace(/\s|[-()]/g,''))?'':'Enter a valid 10-digit Indian mobile number.',
 address:v=>v.trim().length>=8?'':'Enter a complete delivery address.',
 city:v=>v.trim().length>=2?'':'Enter a valid city.',
 state:v=>v.trim().length>=2?'':'Enter a valid state.',
 postalCode:v=>/^[1-9][0-9]{5}$/.test(v.trim())?'':'Enter a valid 6-digit postal code.',
 country:v=>v.trim().length>=2?'':'Enter a valid country.'
};
export default function Checkout(){
 const {cart}=useCart(); const nav=useNavigate();
 const [form,setForm]=useState(initial),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const set=(key,value)=>setForm(x=>({...x,[key]:value}));
 const validate=()=>{for(const key of Object.keys(validators)){const msg=validators[key](String(form[key]??''));if(msg)return msg;}return '';};
 const submit=async e=>{e.preventDefault();setError('');const validation=validate();if(validation){setError(validation);return;}setLoading(true);try{const shippingAddress=Object.fromEntries(Object.entries(form).map(([k,v])=>[k,String(v).trim()]));const order=(await api.post('/orders',{shippingAddress})).data.order;const pay=(await api.post('/payment/create-checkout-session',{orderId:order._id})).data;if(pay.checkoutUrl)window.location.href=pay.checkoutUrl;else nav(`/orders/${order._id}`);}catch(e){setError(errorMessage(e,'Checkout could not be started. Please try again.'));}finally{setLoading(false);}};
 if(!cart.items.length)return <><Navbar/><main className="page"><EmptyState title="Your cart is empty" action={<Link className="btn primary" to="/products">Browse products</Link>}/></main><Footer/></>;
 return <><Navbar/><main className="page"><div className="page-heading"><div><span className="eyebrow">SECURE CHECKOUT</span><h1>Delivery & payment</h1><p>Payment is completed through the backend Stripe checkout flow.</p></div></div>{error&&<div className="alert error" role="alert">{error}</div>}<div className="checkout-layout"><form className="checkout-form" onSubmit={submit} noValidate><h2>Shipping information</h2><div className="two"><label>Full name *<input required autoComplete="name" value={form.fullName} onChange={e=>set('fullName',e.target.value)} minLength="2"/></label><label>Phone *<input required type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={e=>set('phone',e.target.value.replace(/[^0-9\s()-]/g,''))} maxLength="14"/></label></div><label>Address *<input required autoComplete="street-address" value={form.address} onChange={e=>set('address',e.target.value)} minLength="8"/></label><div className="two"><label>City *<input required autoComplete="address-level2" value={form.city} onChange={e=>set('city',e.target.value)} minLength="2"/></label><label>State *<input required autoComplete="address-level1" value={form.state} onChange={e=>set('state',e.target.value)} minLength="2"/></label></div><div className="two"><label>Postal code *<input required inputMode="numeric" autoComplete="postal-code" value={form.postalCode} onChange={e=>set('postalCode',e.target.value.replace(/\D/g,''))} maxLength="6"/></label><label>Country *<input required autoComplete="country-name" value={form.country} onChange={e=>set('country',e.target.value)}/></label></div><button type="submit" className="btn primary full big" disabled={loading}>{loading?'Creating secure checkout...':'Continue to Stripe'}</button></form><aside className="summary"><h2>Order summary</h2>{cart.items.map(i=><div key={i.product._id}><span>{i.product.name} × {i.quantity}</span><b>{money(i.lineTotal)}</b></div>)}<hr/><div><span>Subtotal</span><b>{money(cart.subtotal)}</b></div><div><span>Shipping</span><b>{money(cart.shipping)}</b></div><div><span>Tax</span><b>{money(cart.tax)}</b></div><div className="total"><span>Total</span><strong>{money(cart.total)}</strong></div></aside></div></main><Footer/></>;
}
