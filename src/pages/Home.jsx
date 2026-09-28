import {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';
import {CATEGORIES,CATEGORY_IMAGES} from '../utils/helpers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import ProductImage from '../components/ProductImage';
import Loading from '../components/Loading';

const CATEGORY_SHOWCASE = [
  'Computers & Laptops',
  'Mobile & Tablets',
  'Audio & Wearables',
  'Gaming & Entertainment',
];

const HERO_SLIDE_SIZE = 3;

const groupProducts = (items = []) => {
  const groups = [];
  for (let index = 0; index < items.length; index += HERO_SLIDE_SIZE) {
    const group = items.slice(index, index + HERO_SLIDE_SIZE);
    if (group.length) groups.push(group);
  }
  return groups;
};

export default function Home(){
  const [products,setProducts]=useState([]),[loading,setLoading]=useState(true);
  const [heroIndex,setHeroIndex]=useState(0),[heroPaused,setHeroPaused]=useState(false);

  useEffect(()=>{
    api.get('/products',{params:{limit:12,sort:'popular'}})
      .then(r=>setProducts(r.data.products||[]))
      .finally(()=>setLoading(false));
  },[]);

  const heroSlides = useMemo(() => groupProducts(products), [products]);

  useEffect(()=>{
    if(heroIndex > Math.max(heroSlides.length - 1,0)) setHeroIndex(0);
  },[heroIndex,heroSlides.length]);

  useEffect(()=>{
    if(heroSlides.length < 2 || heroPaused) return undefined;
    const timer=window.setInterval(()=>setHeroIndex(index => (index + 1) % heroSlides.length),4500);
    return ()=>window.clearInterval(timer);
  },[heroSlides.length,heroPaused]);

  const moveHero = (direction) => {
    if(!heroSlides.length) return;
    setHeroIndex(index => (index + direction + heroSlides.length) % heroSlides.length);
  };

  return <><Navbar/><main>
    <section
      className="hero hero-slider"
      aria-label="VOLTIX featured electronics"
      onMouseEnter={()=>setHeroPaused(true)}
      onMouseLeave={()=>setHeroPaused(false)}
      onFocus={()=>setHeroPaused(true)}
      onBlur={(event)=>{if(!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false)}}
    >
      <div className="hero-copy">
        <span className="eyebrow">POWER YOUR EVERYDAY.</span>
        <div className="hero-kicker">SMART ELECTRONICS · CURATED FOR YOU</div>
        <h1>Power your everyday.<br/><em>Discover. Compare. Connect.</em></h1>
        <p>Explore laptops, smartphones, audio devices, wearables, gaming gear and the latest electronics in one place.</p>
        <div className="actions"><Link className="btn primary big" to="/products">Shop electronics</Link><Link className="btn ghost big" to="/compare">Compare products</Link></div>
        <div className="hero-trust-row" aria-label="Shopping highlights">
          <span>12 curated products</span><span>Compare specs</span><span>Secure checkout</span>
        </div>
      </div>

      {heroSlides.length > 0 ? <div className="hero-product-slider" aria-label={`Featured product slide ${heroIndex + 1} of ${heroSlides.length}`}>
        <div className="hero-slide-topline">
          <span>FEATURED PRODUCTS</span>
          <b>{String(heroIndex + 1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}</b>
        </div>
        <div className="hero-product-grid">
          {heroSlides[heroIndex].map((product,index)=><Link
            key={product._id || product.sku || product.name}
            className={`hero-product hero-product-${index+1}`}
            to={`/products/${product._id}`}
            aria-label={`View ${product.name}`}
          >
            <div className="hero-product-image"><ProductImage product={product} priority={heroIndex===0}/></div>
          </Link>)}
        </div>
        <div className="hero-slider-controls">
          <button type="button" className="hero-arrow" onClick={()=>moveHero(-1)} aria-label="Previous featured products">←</button>
          <div className="hero-dots" role="tablist" aria-label="Featured product slides">
            {heroSlides.map((_,index)=><button key={index} type="button" role="tab" aria-selected={index===heroIndex} aria-label={`Go to slide ${index+1}`} className={index===heroIndex?'active':''} onClick={()=>setHeroIndex(index)} />)}
          </div>
          <button type="button" className="hero-arrow" onClick={()=>moveHero(1)} aria-label="Next featured products">→</button>
        </div>
      </div> : <div className="hero-art category-showcase" aria-label="VOLTIX category showcase">
        {CATEGORY_SHOWCASE.map((name,index)=><Link key={name} className={`hero-category hero-category-${index+1}`} to={`/products?majorCategory=${encodeURIComponent(name)}`} aria-label={`Shop ${name}`}>
          <img src={CATEGORY_IMAGES[name]} alt={`${name} product`} loading={index===0?'eager':'lazy'} onError={e=>{e.currentTarget.style.display='none'}}/>
        </Link>)}
      </div>}
    </section>

    <section className="section"><div className="section-head"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Find your next device.</h2></div></div><div className="category-grid">{CATEGORIES.map(c=><CategoryCard key={c.name} category={c}/>)}</div></section>
    <section className="section soft"><div className="section-head"><div><span className="eyebrow">POPULAR NOW</span><h2>Best-selling electronics.</h2></div><Link to="/products?sort=popular">View all →</Link></div>{loading?<Loading/>:<ProductGrid products={products.slice(0,8)}/>}</section>
    <section className="split-promo section"><div><span className="eyebrow">COMPARE BEFORE YOU BUY</span><h2>Better decisions start with better specs.</h2><p>Put laptops, phones, headphones, monitors and gaming products side by side and see what matters.</p><Link className="btn dark" to="/compare">Open comparison</Link></div><div className="spec-stack"><span>Processor</span><span>Display</span><span>Storage</span><span>Battery</span><span>Rating</span></div></section>
    <section className="section benefits-section"><div className="section-head"><div><span className="eyebrow">WHY VOLTIX</span><h2>Smart shopping by design.</h2></div></div><div className="feature-grid"><article><b>01</b><h3>Useful product data</h3><p>See technical specifications, ratings and stock before you buy.</p></article><article><b>02</b><h3>One account, one flow</h3><p>Keep your cart, wishlist and orders together.</p></article><article><b>03</b><h3>Secure payments</h3><p>Checkout connects to the backend's Stripe payment flow.</p></article></div></section>
  </main><Footer/></>;
}
