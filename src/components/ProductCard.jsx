import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {money,discount,errorMessage} from '../utils/helpers';
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';
import ProductImage from './ProductImage';
import {useCart} from '../context/CartContext';
import {useAuth} from '../context/AuthContext';

export default function ProductCard({product}) {
  const nav = useNavigate();
  const {add} = useCart();
  const {isAuthenticated} = useAuth();
  const [notice,setNotice] = useState('');
  const d = discount(product);
  const specs = Object.entries(product.specifications || {}).slice(0, 3).map(([k,v]) => `${k}: ${v}`);

  return (
    <article className="product-card" onClick={() => nav(`/products/${product._id}`)}>
      <div className="product-image">
        <ProductImage product={product} />
        {d > 0 && <span className="badge sale">-{d}%</span>}
        <WishlistButton productId={product._id}/>
      </div>
      <div className="product-info">
        <span className="eyebrow">{product.brand} · {product.subcategory}</span>
        <h3>{product.name}</h3>
        <small className="product-model">{product.model ? `Model ${product.model}` : ' '}</small>
        <RatingStars value={product.rating} count={product.reviewCount}/>
        {specs.length > 0 && <div className="spec-highlights">{specs.map((s,i) => <span key={i}>{s}</span>)}</div>}
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
        </div>
        <p className={product.stock > 0 ? 'stock' : 'stock out'}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div className="product-actions">
        <button className="btn primary full" disabled={!product.stock} onClick={async e => {
          e.stopPropagation();
          if (!isAuthenticated) return nav('/login');
          try {
            await add(product._id, 1);
            setNotice('Added to cart');
            window.setTimeout(()=>setNotice(''),1800);
          } catch (err) {
            setNotice(errorMessage(err,'Could not add this item.'));
            window.setTimeout(()=>setNotice(''),2600);
          }
        }}>{product.stock ? 'Add to cart' : 'Out of stock'}</button>
        <button className="text-btn product-details-link" type="button" onClick={e => { e.stopPropagation(); nav(`/products/${product._id}`); }}>View details <span aria-hidden="true">→</span></button>
        {notice && <div className={`product-notice ${notice==='Added to cart'?'success':'error'}`} role="status">{notice}</div>}
        </div>
      </div>
    </article>
  );
}
