import {Link,useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import {useWishlist} from '../context/WishlistContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

export default function Navbar(){
  const {user,isAuthenticated,isAdmin,logout}=useAuth();
  const {quantityCount}=useCart();
  const {items}=useWishlist();
  const [open,setOpen]=useState(false);
  const nav=useNavigate();
  return <header className="navbar">
    <div className="nav-inner">
      <Link className="brand" to="/" onClick={()=>setOpen(false)}>
        <span className="brand-mark">V</span>
        <span>VOLTIX<small>SMART ELECTRONICS MARKETPLACE</small></span>
      </Link>
      <button className="mobile-menu" type="button" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}>☰</button>
      <div className={`nav-content ${open?'open':''}`}>
        <SearchBar/>
        <nav className="nav-links">
          <Link className="nav-item" to="/products" onClick={()=>setOpen(false)}>Shop</Link>
          <Link className="nav-item" to="/compare" onClick={()=>setOpen(false)}>Compare</Link>
          <ThemeToggle compact />
          {isAdmin&&<Link className="nav-item nav-admin" to="/admin" onClick={()=>setOpen(false)}>Admin</Link>}
          <Link className="nav-item nav-icon-link" to="/wishlist" onClick={()=>setOpen(false)} aria-label={`Wishlist, ${items.length} items`}>
            <span className="nav-icon" aria-hidden="true">♡</span><span className="nav-label">Wishlist</span><span className="nav-count">{items.length}</span>
          </Link>
          <Link className="nav-item nav-icon-link" to="/cart" onClick={()=>setOpen(false)} aria-label={`Cart, ${quantityCount} items`}>
            <span className="nav-icon" aria-hidden="true">🛒</span><span className="nav-label">Cart</span><span className="nav-count">{quantityCount}</span>
          </Link>
          {isAuthenticated?
            <div className="account">
              <Link className="account-user" to="/profile" onClick={()=>setOpen(false)}>
                <span className="account-avatar">{(user?.firstName||'A').slice(0,1).toUpperCase()}</span>
                <span>{user?.firstName||'Account'}</span>
              </Link>
              <button className="account-logout" onClick={()=>{logout();nav('/');setOpen(false)}}>Logout</button>
            </div>:
            <div className="account">
              <Link className="account-login" to="/login" onClick={()=>setOpen(false)}>Login</Link>
              <Link className="nav-signup" to="/register" onClick={()=>setOpen(false)}>Create account</Link>
            </div>}
        </nav>
      </div>
    </div>
  </header>
}
