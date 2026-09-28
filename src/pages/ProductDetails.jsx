import {useEffect,useState} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import api from '../services/api';
import {money,discount,errorMessage,productSpecs,formatSpecLabel} from '../utils/helpers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RatingStars from '../components/RatingStars';
import WishlistButton from '../components/WishlistButton';
import ProductGrid from '../components/ProductGrid';
import ProductImage from '../components/ProductImage';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {useCart} from '../context/CartContext';
import {useAuth} from '../context/AuthContext';

export default function ProductDetails() {
  const {id} = useParams(), nav = useNavigate();
  const {add} = useCart();
  const {user,isAuthenticated} = useAuth();
  const [p,setP] = useState(null), [related,setRelated] = useState([]), [reviews,setReviews] = useState([]), [dist,setDist] = useState({});
  const [qty,setQty] = useState(1), [loading,setLoading] = useState(true), [error,setError] = useState(''), [editing,setEditing] = useState(null), [notice,setNotice] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [a,b,c] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/related`),
        api.get(`/products/${id}/reviews`)
      ]);
      setP(a.data.product); setRelated(b.data.products || []); setReviews(c.data.reviews || []); setDist(c.data.distribution || {});
    } catch (e) { setError(errorMessage(e,'Product could not be loaded.')); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <><Navbar/><Loading/><Footer/></>;
  if (error || !p) return <><Navbar/><main className="page"><ErrorMessage message={error || 'Product not found.'}/></main><Footer/></>;

  const d = discount(p);
  const specs = productSpecs(p);
  const own = reviews.find(r => String(r.user?._id || r.user) === String(user?.id));
  const submitReview = async data => {
    try {
      if (editing) await api.put(`/reviews/${editing._id}`,data); else await api.post(`/products/${id}/reviews`,data);
      setEditing(null); await load(); setNotice('Review saved.');
    } catch (e) { setNotice(errorMessage(e)); }
  };

  return <>
    <Navbar/>
    <main className="page">
      <div className="breadcrumbs"><Link to="/products">Products</Link> / {p.name}</div>
      <section className="detail">
        <div className="gallery"><ProductImage product={p} className="detail-image" priority showGallery /></div>
        <div className="detail-copy">
          <span className="eyebrow">{p.brand} · {p.subcategory}</span>
          <h1>{p.name}</h1>
          <p className="model">Model {p.model || '—'} · SKU {p.sku}</p>
          <div className="rating-line"><RatingStars value={p.rating} count={p.reviewCount}/></div>
          <div className="detail-price"><strong>{money(p.price)}</strong>{p.originalPrice > p.price && <><del>{money(p.originalPrice)}</del><span className="badge sale">-{d}%</span></>}</div>
          <p className="product-description">{p.description}</p>
          <p className={p.stock ? 'stock' : 'stock out'}>{p.stock ? `${p.stock} units available` : 'Out of stock'}</p>
          <div className="buy-row">
            <div className="qty" aria-label="Quantity">
              <button type="button" onClick={() => setQty(Math.max(1,qty-1))}>−</button>
              <span>{qty}</span>
              <button type="button" disabled={!p.stock || qty >= p.stock} onClick={() => setQty(Math.min(p.stock,qty+1))}>+</button>
            </div>
            <button className="btn primary" disabled={!p.stock} onClick={async()=>{if(!isAuthenticated)return nav('/login');try{await add(p._id,qty);setNotice('Added to cart.')}catch(e){setNotice(errorMessage(e))}}}>Add to cart</button>
            <button className="btn ghost" disabled={!p.stock} onClick={async()=>{if(!isAuthenticated)return nav('/login');try{await add(p._id,qty);nav('/cart')}catch(e){setNotice(errorMessage(e))}}}>Buy now</button>
            <WishlistButton productId={p._id}/>
          </div>
          {notice && <div className="alert success" role="status">{notice}</div>}
          <div className="trust"><span>✓ Secure checkout</span><span>✓ Backend-verified stock</span><span>✓ Order tracking</span></div>
        </div>
      </section>

      <section className="detail-section">
        <div className="section-head">
          <div><span className="eyebrow">PRODUCT INFORMATION</span><h2>Overview & technical details</h2></div>
          <span className="detail-category">{p.majorCategory} · {p.subcategory}</span>
        </div>
        <div className="product-overview-grid">
          <article className="panel product-overview">
            <h3>About this product</h3>
            <p>{p.description || 'Explore the product specifications, availability and customer feedback before you buy.'}</p>
            <div className="product-meta">
              <div><span>Brand</span><b>{p.brand || '—'}</b></div>
              <div><span>Model</span><b>{p.model || '—'}</b></div>
              <div><span>SKU</span><b>{p.sku || '—'}</b></div>
              <div><span>Warranty</span><b>{p.specifications?.Warranty || 'See seller details'}</b></div>
            </div>
          </article>
          <article className="panel">
            <h3>Delivery & purchase information</h3>
            <ul className="detail-points">
              <li><b>{p.stock > 0 ? 'In stock' : 'Currently unavailable'}</b> — live stock is verified by the backend.</li>
              <li><b>Secure checkout</b> — payment is handled through the application's Stripe flow.</li>
              <li><b>Order tracking</b> — purchases are available in your VOLTIX order history.</li>
              <li><b>Wishlist & compare</b> — save this product or compare it with other electronics.</li>
            </ul>
          </article>
        </div>
        <div className="spec-table">
          {specs.length ? specs.map(([key,value]) => (
            <div key={key}><b>{formatSpecLabel(key)}</b><span>{String(value)}</span></div>
          )) : <div><b>Specifications</b><span>Detailed specifications are not available for this product yet.</span></div>}
        </div>
      </section>

      <section className="detail-section">
        <div className="review-header">
          <div><span className="eyebrow">CUSTOMER REVIEWS</span><h2>{p.rating?.toFixed?.(1) || '0.0'} / 5</h2><RatingStars value={p.rating} count={p.reviewCount}/>{reviews.some(r=>r.isDemo)&&<small className="review-demo-note">Sample reviews are clearly marked until real customer reviews are added.</small>}</div>
          <div className="distribution">{[5,4,3,2,1].map(n=><div key={n}><span>{n}★</span><div><i style={{width:`${reviews.length ? (dist[n]||0)/reviews.length*100 : 0}%`}}/></div><small>{dist[n]||0}</small></div>)}</div>
        </div>
        {isAuthenticated && !own && !editing && <ReviewForm onSubmit={submitReview}/>} {editing && <ReviewForm initial={editing} onSubmit={submitReview} onCancel={()=>setEditing(null)}/>} 
        {reviews.length ? <div className="review-list">{reviews.map(r=><ReviewCard key={r._id} review={r} onEdit={String(r.user?._id||r.user)===String(user?.id)?()=>setEditing(r):null} onDelete={String(r.user?._id||r.user)===String(user?.id)?async()=>{if(confirm('Delete this review?')){await api.delete(`/reviews/${r._id}`);load()}}:null}/>)}</div> : <div className="empty review-empty"><h3>No written reviews yet</h3><p>{p.reviewCount ? 'This product has a customer rating, but individual review comments are not available yet.' : 'Be the first customer to share a rating and review.'}</p></div>}
      </section>

      {related.length > 0 && (
        <section className="detail-section related-section">
          <div className="section-head">
            <div><span className="eyebrow">COMPLETE YOUR SETUP</span><h2>Related {p.subcategory || 'products'}</h2><p className="muted">More products from the same VOLTIX category, selected to help you compare and build your setup.</p></div>
            <Link to={`/products?majorCategory=${encodeURIComponent(p.majorCategory || '')}`}>View category →</Link>
          </div>
          <ProductGrid products={related.slice(0,4)}/>
        </section>
      )}
    </main>
    <Footer/>
  </>;
}
