import {useState} from 'react';
import {CATEGORIES} from '../utils/helpers';

export default function ProductForm({initial={},onSubmit,submitLabel='Save product'}){
  const [f,setF]=useState(()=>({
    name:initial.name||'',brand:initial.brand||'',model:initial.model||'',description:initial.description||'',
    majorCategory:initial.majorCategory||CATEGORIES[0].name,
    subcategory:initial.subcategory||(CATEGORIES.find(c=>c.name===initial.majorCategory)||CATEGORIES[0]).subcategories[0],
    price:initial.price??'',originalPrice:initial.originalPrice??'',discount:initial.discount??'',
    images:Array.isArray(initial.images)?initial.images.join('\n'):(initial.images||''),stock:initial.stock??'',sku:initial.sku||'',
    initialRating:initial.initialRating??'0',
    specifications:initial.specifications?JSON.stringify(initial.specifications,null,2):'{}',
    tags:Array.isArray(initial.tags)?initial.tags.join(', '):(initial.tags||''),featured:Boolean(initial.featured)
  })),[error,setError]=useState('');
  const cat=CATEGORIES.find(c=>c.name===f.majorCategory)||CATEGORIES[0];
  return <form className="product-form" onSubmit={e=>{
    e.preventDefault();setError('');
    try{
      const name=f.name.trim(),brand=f.brand.trim(),sku=f.sku.trim();
      const price=Number(f.price),mrp=f.originalPrice===''?undefined:Number(f.originalPrice),discount=f.discount===''?0:Number(f.discount),stock=Number(f.stock),initialRating=Number(f.initialRating||0);
      if(name.length<2)return setError('Product name must contain at least 2 characters.');
      if(brand.length<2)return setError('Brand is required.');
      if(sku.length<2)return setError('SKU must contain at least 2 characters.');
      if(!Number.isFinite(price)||price<=0)return setError('Selling price must be greater than 0.');
      if(mrp!==undefined&&(!Number.isFinite(mrp)||mrp<price))return setError('Original/MRP price must be greater than or equal to selling price.');
      if(!Number.isInteger(stock)||stock<0)return setError('Stock must be a whole number greater than or equal to 0.');
      if(!Number.isFinite(discount)||discount<0||discount>100)return setError('Discount must be between 0 and 100.');
      if(!Number.isFinite(initialRating)||initialRating<0||initialRating>5)return setError('Admin rating must be between 0 and 5.');
      const images=f.images.split(/\n|,/).map(x=>x.trim()).filter(Boolean);
      if(!images.length)return setError('Add at least one real product photo URL from your approved image storage.');
      if(images.length>8)return setError('Add no more than 8 product photos.');
      if(images.some(x=>{try{const u=new URL(x);return !['http:','https:'].includes(u.protocol)}catch{return true}}))return setError('Every product photo must be a valid http(s) URL.');
      const specs=JSON.parse(f.specifications||'{}');
      if(!specs||typeof specs!=='object'||Array.isArray(specs))return setError('Specifications must be a JSON object.');
      onSubmit({...f,name,brand,sku,price,originalPrice:mrp,discount,stock,initialRating,images,tags:f.tags.split(',').map(x=>x.trim()).filter(Boolean),specifications:specs});
    }catch{setError('Specifications must be valid JSON.')}}}>
    {error&&<div className="alert error">{error}</div>}
    <div className="two"><label>Name *<input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Brand *<input required value={f.brand} onChange={e=>setF({...f,brand:e.target.value})}/></label></div>
    <div className="two"><label>Model<input value={f.model} onChange={e=>setF({...f,model:e.target.value})}/></label><label>SKU *<input required value={f.sku} onChange={e=>setF({...f,sku:e.target.value})}/></label></div>
    <label>Description *<textarea required value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></label>
    <div className="two"><label>Major category *<select value={f.majorCategory} onChange={e=>setF({...f,majorCategory:e.target.value,subcategory:(CATEGORIES.find(c=>c.name===e.target.value)||CATEGORIES[0]).subcategories[0]})}>{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select></label><label>Subcategory *<select value={f.subcategory} onChange={e=>setF({...f,subcategory:e.target.value})}>{cat.subcategories.map(x=><option key={x}>{x}</option>)}</select></label></div>
    <div className="three"><label>Price (₹) *<input required type="number" min="0" step="1" value={f.price} onChange={e=>setF({...f,price:e.target.value})}/></label><label>Original/MRP price (₹)<input type="number" min="0" step="1" value={f.originalPrice} onChange={e=>setF({...f,originalPrice:e.target.value})}/></label><label>Discount (%)<input type="number" min="0" max="100" step="1" value={f.discount} onChange={e=>setF({...f,discount:e.target.value})}/></label></div>
    <div className="two"><label>Stock *<input required type="number" min="0" value={f.stock} onChange={e=>setF({...f,stock:e.target.value})}/></label><label>Product availability<select value={Number(f.stock)>0?'inStock':'outOfStock'} onChange={e=>setF({...f,stock:e.target.value==='inStock'?(f.stock||1):0})}><option value="inStock">In stock</option><option value="outOfStock">Out of stock</option></select></label></div>
    <label>Admin initial rating (0–5)<input type="number" min="0" max="5" step="0.1" value={f.initialRating} onChange={e=>setF({...f,initialRating:e.target.value})}/><small className="muted">Customer ratings are combined with this admin rating to calculate the product's final rating.</small></label>
    <label>Product photos * <textarea placeholder="Paste one approved product-photo URL per line" value={f.images} onChange={e=>setF({...f,images:e.target.value})}/></label>
    <label>Tags <input value={f.tags} onChange={e=>setF({...f,tags:e.target.value})}/></label>
    <label>Technical specifications (JSON)<textarea rows="8" value={f.specifications} onChange={e=>setF({...f,specifications:e.target.value})}/></label>
    <label className="check"><input type="checkbox" checked={!!f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Featured product</label>
    <button type="submit" className="btn primary big">{submitLabel}</button>
  </form>
}