import {useNavigate} from 'react-router-dom';
import {CATEGORY_IMAGES} from '../utils/helpers';

export default function CategoryCard({category}) {
  const nav = useNavigate();
  const image = CATEGORY_IMAGES[category.name];
  return (
    <button
      className="category-card category-card-image"
      onClick={() => nav(`/products?majorCategory=${encodeURIComponent(category.name)}`)}
      type="button"
    >
      <div className="category-card-media">
        <img src={image} alt={category.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
      <div className="category-card-copy">
        <b>{category.name}</b>
        <small>{category.subcategories.slice(0,4).join(' · ')}</small>
      </div>
      <strong aria-hidden="true">→</strong>
    </button>
  );
}
