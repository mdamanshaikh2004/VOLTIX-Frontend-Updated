import {useState} from 'react';
import RatingStars from './RatingStars';

export default function ReviewForm({initial,onSubmit,onCancel}){
 const [rating,setRating]=useState(initial?.rating||0),[comment,setComment]=useState(initial?.comment||''),[error,setError]=useState(''),[saving,setSaving]=useState(false);
 const submit=async e=>{
  e.preventDefault();setError('');
  if(!Number.isInteger(Number(rating))||rating<1||rating>5)return setError('Please select a rating from 1 to 5 stars.');
  if(comment.trim().length<2)return setError('Review must contain at least 2 characters.');
  setSaving(true);
  try{await onSubmit({rating:Number(rating),comment:comment.trim()});}catch(err){setError(err?.message||'Could not save your review. Please try again.');}finally{setSaving(false);}
 };
 return <form className="review-form" onSubmit={submit} noValidate>
  <h3>{initial?'Edit review':'Write a review'}</h3>
  <RatingStars value={rating} interactive onChange={setRating}/>
  <span className="review-required">Rating *</span>
  {error&&<div className="alert error" role="alert">{error}</div>}
  <textarea required minLength="2" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience..." aria-label="Review comment" disabled={saving}/>
  <div className="actions">
   <button type="submit" className="btn primary" disabled={saving}>{saving?'Saving…':initial?'Save review':'Submit review'}</button>
   {onCancel&&<button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>}
  </div>
 </form>
}
