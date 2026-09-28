import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {errorMessage,strongPassword,CATEGORIES} from '../utils/helpers';
import ThemeToggle from '../components/ThemeToggle';

const DEVICES=['Laptop','Desktop','Smartphone','Tablet','Headphones','Smartwatch','Gaming'];
const BUDGETS=['Under ₹10,000','₹10,000 – ₹25,000','₹25,000 – ₹50,000','₹50,000 – ₹1,00,000','₹1,00,000+'];

function EyeIcon({open=false}){
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 3l18 18"/><path d="M10.6 10.7a3 3 0 0 0 4 4"/><path d="M9.9 4.2A11.7 11.7 0 0 1 12 4c5.2 0 8.7 4.2 9.7 6a1.9 1.9 0 0 1 0 2 15 15 0 0 1-3.1 3.6"/><path d="M6.1 6.1A15 15 0 0 0 2.3 10a1.9 1.9 0 0 0 0 2c1 1.8 4.5 6 9.7 6 1 0 2-.1 2.9-.4"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.3 12S6 5.8 12 5.8 21.7 12 21.7 12 18 18.2 12 18.2 2.3 12 2.3 12Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

export default function Register(){
 const [form,setForm]=useState({firstName:'',lastName:'',email:'',password:'',confirmPassword:'',dateOfBirth:'',gender:'prefer-not-to-say',genderOther:'',phone:'',interestedCategories:[],preferredDeviceTypes:[],budgetRange:'',marketingOptIn:false,termsAccepted:false});
 const [showPassword,setShowPassword]=useState(false),[showConfirm,setShowConfirm]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false),[details,setDetails]=useState(false);
 const {register}=useAuth(); const nav=useNavigate();
 const set=(key,value)=>setForm(x=>({...x,[key]:value}));
 const toggle=(key,value)=>set(key,form[key].includes(value)?form[key].filter(v=>v!==value):[...form[key],value]);
 const submit=async e=>{e.preventDefault();setError('');const firstName=form.firstName.trim(),lastName=form.lastName.trim(),email=form.email.trim().toLowerCase();
  if(!firstName||!lastName)return setError('First and last name are required.');
  if(!/^\S+@\S+\.\S+$/.test(email))return setError('Please enter a valid email address.');
  if(form.phone && !/^[0-9+()\-\s]{7,25}$/.test(form.phone.trim()))return setError('Please enter a valid phone number.');
  if(form.gender==='other'&&!form.genderOther.trim())return setError('Please tell us your gender or choose another option.');
  if(form.password.length>128)return setError('Password must be 128 characters or fewer.');
  if(!strongPassword(form.password)){return setError('Please choose a stronger password. Use a unique mix of letters, numbers, and symbols.')}
  if(form.password!==form.confirmPassword)return setError('Passwords do not match.');
  if(!form.termsAccepted)return setError('Please accept the Terms & Conditions and Privacy Policy.');
  setLoading(true);try{const result=await register({...form,firstName,lastName,email,phone:form.phone.trim()});nav(`/verify-email?email=${encodeURIComponent(email)}`,{replace:true,state:{message:result.message}})}catch(e){setError(errorMessage(e,'Unable to create account.'))}finally{setLoading(false)}
 };
 return <div className="auth-page">
   <div className="auth-brand">
     <Link className="brand" to="/"><span className="brand-mark">V</span><span>VOLTIX<small>SMART ELECTRONICS MARKETPLACE</small></span></Link>
     <div className="auth-copy">
       <span className="eyebrow">POWER YOUR EVERYDAY.</span>
       <h1>Build your<br/><em>tech setup.</em></h1>
       <p>Create a VOLTIX account and get recommendations that match how you shop.</p>
       <div className="benefits"><b>✓ Email OTP verification for account security</b><b>✓ Personalized product discovery</b><b>✓ Wishlist, cart and order tracking</b></div>
     </div>
   </div>
   <div className="auth-card">
     <div className="auth-theme"><ThemeToggle compact /></div>
     <div className="form-wrap">
       <span className="eyebrow">CREATE ACCOUNT</span><h2>Join VOLTIX</h2><p className="muted">Create your account, then verify your email with a 6-digit code.</p>
       {error&&<div className="alert error" role="alert">{error}</div>}
       <form className="register-form" onSubmit={submit} noValidate>
         <div className="two"><label>First name *<input required autoComplete="given-name" value={form.firstName} onChange={e=>set('firstName',e.target.value)} /></label><label>Last name *<input required autoComplete="family-name" value={form.lastName} onChange={e=>set('lastName',e.target.value)} /></label></div>
         <label>Email address *<input required type="email" autoComplete="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" /></label>
         <div className="two"><label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e=>set('dateOfBirth',e.target.value)} /><small className="field-hint">Used only to personalize your account. Minimum age 13.</small></label><label>Gender<select value={form.gender} onChange={e=>set('gender',e.target.value)}><option value="prefer-not-to-say">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="non-binary">Non-binary</option><option value="other">Other</option></select></label></div>
         {form.gender==='other'&&<label>Gender description<input maxLength="60" value={form.genderOther} onChange={e=>set('genderOther',e.target.value)} placeholder="Optional description" /></label>}
         <div className="two"><label>Phone number <span className="optional">Optional</span><input type="tel" autoComplete="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 98765 43210" /></label><label>Shopping budget <span className="optional">Optional</span><select value={form.budgetRange} onChange={e=>set('budgetRange',e.target.value)}><option value="">Select a range</option>{BUDGETS.map(v=><option key={v}>{v}</option>)}</select></label></div>
         <button type="button" className="details-toggle" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>{details?'−':'+'} Personalize your shopping experience</button>
         {details&&<div className="personalize-panel"><fieldset><legend>What are you interested in?</legend><div className="chip-grid">{CATEGORIES.map(c=><label className="choice-check" key={c.name}><input type="checkbox" checked={form.interestedCategories.includes(c.name)} onChange={()=>toggle('interestedCategories',c.name)}/><span>{c.name}</span></label>)}</div></fieldset><fieldset><legend>Preferred device types</legend><div className="chip-grid">{DEVICES.map(v=><label className="choice-check" key={v}><input type="checkbox" checked={form.preferredDeviceTypes.includes(v)} onChange={()=>toggle('preferredDeviceTypes',v)}/><span>{v}</span></label>)}</div></fieldset></div>}
         <label>Password *<div className="password"><input required type={showPassword?'text':'password'} autoComplete="new-password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Create a strong password"/><button type="button" className="password-eye" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <EyeIcon open /> : <EyeIcon />}</button></div><small className="password-helper">Use a unique password with letters, numbers, and symbols.</small></label>
         <label>Confirm password *<div className="password"><input required type={showConfirm?'text':'password'} autoComplete="new-password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} placeholder="Re-enter your password"/><button type="button" className="password-eye" aria-label={showConfirm?'Hide password':'Show password'} onClick={()=>setShowConfirm(!showConfirm)}>{showConfirm ? <EyeIcon open /> : <EyeIcon />}</button></div></label>
         <label className="check-row"><input type="checkbox" checked={form.marketingOptIn} onChange={e=>set('marketingOptIn',e.target.checked)}/><span>Send me occasional VOLTIX deals and product updates. <small>Optional</small></span></label>
         <label className="check-row"><input type="checkbox" checked={form.termsAccepted} onChange={e=>set('termsAccepted',e.target.checked)} required/><span>I agree to the Terms & Conditions and Privacy Policy. *</span></label>
         <button type="submit" disabled={loading} className="btn primary full big">{loading?'Creating account...':'Create account'}</button>
       </form><div className="auth-bottom">Already have an account? <Link to="/login">Sign in</Link></div>
     </div>
   </div>
 </div>;
}
