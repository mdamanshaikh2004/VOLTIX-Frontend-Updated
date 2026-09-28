import {CATEGORIES,SORTS,money} from '../utils/helpers';

const PRICE_STEP=5000;
const DEFAULT_MIN_PRICE=5000;

export default function FilterSidebar({filters,setFilters,onApply,priceRange={min:0,max:0}}){
 const rawMax=Number(priceRange.max)||DEFAULT_MIN_PRICE;
 const minBound=DEFAULT_MIN_PRICE;
 const maxBound=Math.max(minBound,Math.ceil(rawMax/PRICE_STEP)*PRICE_STEP);
 const minValue=Math.min(maxBound,Math.max(minBound,filters.minPrice===''||filters.minPrice==null?minBound:Number(filters.minPrice)||minBound));
 const maxValue=Math.max(minValue,Math.min(maxBound,filters.maxPrice===''||filters.maxPrice==null?maxBound:Number(filters.maxPrice)||maxBound));
 const setMin=v=>setFilters({...filters,minPrice:Math.min(Number(v),maxValue)});
 const setMax=v=>setFilters({...filters,maxPrice:Math.max(Number(v),minValue)});
 const clear=()=>setFilters({});

 return <aside className="filters">
  <div className="filter-head"><h3>Filters</h3><button type="button" onClick={clear}>Clear</button></div>
  <label>Category<select value={filters.majorCategory||''} onChange={e=>setFilters({...filters,majorCategory:e.target.value,subcategory:'',minPrice:'',maxPrice:''})}><option value="">All categories</option>{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select></label>
  {filters.majorCategory&&<label>Subcategory<select value={filters.subcategory||''} onChange={e=>setFilters({...filters,subcategory:e.target.value})}><option value="">All subcategories</option>{CATEGORIES.find(c=>c.name===filters.majorCategory)?.subcategories.map(s=><option key={s}>{s}</option>)}</select></label>}
  <label>Brand<input value={filters.brand||''} onChange={e=>setFilters({...filters,brand:e.target.value})} placeholder="e.g. Apple"/></label>
  <div className="price-filter">
   <div className="filter-label-row"><b>Price range</b><span>{money(minValue)} – {money(maxValue)}</span></div>
   <div className="range-stack">
    <input aria-label="Minimum price" type="range" min={minBound} max={maxBound} step={PRICE_STEP} value={minValue} onChange={e=>setMin(e.target.value)}/>
    <input aria-label="Maximum price" type="range" min={minBound} max={maxBound} step={PRICE_STEP} value={maxValue} onChange={e=>setMax(e.target.value)}/>
   </div>
   <div className="two">
    <label>Min price<input type="number" min={minBound} max={maxBound} step={PRICE_STEP} value={filters.minPrice??''} onChange={e=>setFilters({...filters,minPrice:e.target.value})}/></label>
    <label>Max price<input type="number" min={minBound} max={maxBound} step={PRICE_STEP} value={filters.maxPrice??''} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}/></label>
   </div>
   <small className="filter-help">Starts at ₹5,000 · increments of ₹5,000</small>
  </div>
  <label>Rating<select value={filters.rating||''} onChange={e=>setFilters({...filters,rating:e.target.value})}><option value="">Any rating</option>{[4,3,2,1].map(x=><option key={x} value={x}>{x}+ stars</option>)}</select></label>
  <label>Availability<select value={filters.availability||''} onChange={e=>setFilters({...filters,availability:e.target.value})}><option value="">All</option><option value="inStock">In stock</option><option value="outOfStock">Out of stock</option></select></label>
  <label>Sort<select value={filters.sort||'newest'} onChange={e=>setFilters({...filters,sort:e.target.value})}>{SORTS.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
  <button type="button" className="btn primary full" onClick={onApply}>Apply filters</button>
 </aside>
}
