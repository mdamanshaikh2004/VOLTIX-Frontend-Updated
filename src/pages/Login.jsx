import {useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {errorMessage} from '../utils/helpers';
import ThemeToggle from '../components/ThemeToggle';

function EyeIcon({open=false}){
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 3l18 18"/><path d="M10.6 10.7a3 3 0 0 0 4 4"/><path d="M9.9 4.2A11.7 11.7 0 0 1 12 4c5.2 0 8.7 4.2 9.7 6a1.9 1.9 0 0 1 0 2 15 15 0 0 1-3.1 3.6"/><path d="M6.1 6.1A15 15 0 0 0 2.3 10a1.9 1.9 0 0 0 0 2c1 1.8 4.5 6 9.7 6 1 0 2-.1 2.9-.4"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.3 12S6 5.8 12 5.8 21.7 12 21.7 12 18 18.2 12 18.2 2.3 12 2.3 12Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

export default function Login(){
 const [form,setForm]=useState({email:'',password:''});const [unverified,setUnverified]=useState(false);
 const [show,setShow]=useState(false),[adminMode,setAdminMode]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const {login,logout}=useAuth(); const nav=useNavigate(),loc=useLocation();
 const submit=async e=>{
   e.preventDefault(); setError(''); setUnverified(false);
   const email=form.email.trim().toLowerCase();
   if(!email || !/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.');
   if(!form.password) return setError('Password is required.');
   if(form.password.length>128) return setError('Password must be 128 characters or fewer.');
   setLoading(true);
   try{
     const result=await login({email,password:form.password});
     if(adminMode && result.user?.role!=='admin'){
       logout();
       throw {response:{data:{message:'This account does not have administrator access.'}}};
     }
     nav(adminMode?'/admin':(loc.state?.from||'/'));
   }catch(e){setError(errorMessage(e,adminMode?'Unable to sign in as administrator.':'Unable to sign in.'));setUnverified(e?.response?.data?.code==='EMAIL_NOT_VERIFIED');}
   finally{setLoading(false);}
 };
 return <div className="auth-page">
   <div className="auth-brand">
     <Link className="brand" to="/"><span className="brand-mark">V</span><span>VOLTIX<small>SMART ELECTRONICS MARKETPLACE</small></span></Link>
     <div className="auth-copy">
       <span className="eyebrow">SMART TECHNOLOGY. BETTER SHOPPING.</span>
       <h1>Everything you need.<br/><em>All in one flow.</em></h1>
       <p>Discover laptops, phones, audio, wearables and gaming gear with a simple shopping experience.</p>
       <div className="benefits"><b>✓ Compare products with useful specifications</b><b>✓ Save favorites to your wishlist</b><b>✓ Secure checkout and order tracking</b></div>
     </div>
   </div>
   <div className="auth-card">
     <div className="auth-theme"><ThemeToggle compact /></div>
     <div className="form-wrap">
       <div className="login-switch" role="tablist" aria-label="Choose account type">
         <button type="button" className={!adminMode?'active':''} onClick={()=>{setAdminMode(false);setError('');setUnverified(false)}} role="tab" aria-selected={!adminMode}>User login</button>
         <button type="button" className={adminMode?'active':''} onClick={()=>{setAdminMode(true);setError('');setUnverified(false)}} role="tab" aria-selected={adminMode}>Admin login</button>
       </div>
       <span className="eyebrow">{adminMode?'ADMIN ACCESS':'WELCOME BACK'}</span>
       <h2>{adminMode?'Admin sign in':'Sign in to VOLTIX'}</h2>
       <p className="muted">{adminMode?'Use an authorized VOLTIX administrator account.':'Access your account and continue shopping.'}</p>
       {error&&<div className="alert error" role="alert">{error}</div>}
       {unverified&&!adminMode&&<p className="auth-bottom"><Link to={`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`}>Send a new verification email</Link></p>}
       <form onSubmit={submit} noValidate>
         <label>Email address *<input required type="email" autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
         <label>Password *<span className="field-link"><Link to="/forgot-password">Forgot password?</Link></span><div className="password"><input required type={show?'text':'password'} autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/><button className="password-eye" type="button" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show ? <EyeIcon open /> : <EyeIcon />}</button></div></label>
         <button type="submit" className="btn primary full big" disabled={loading}>{loading?'Signing in...':(adminMode?'Sign in as admin':'Sign in')}</button>
       </form>
       {!adminMode&&<p className="auth-bottom">New to VOLTIX? <Link to="/register">Create an account</Link></p>}
     </div>
   </div>
 </div>;
}
