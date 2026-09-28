import { useEffect, useMemo, useState } from 'react';

const GENERIC_IMAGE_HOSTS = [
  'picsum.photos',
  'source.unsplash.com',
  'images.unsplash.com',
  'unsplash.com',
  'placehold.co',
  'via.placeholder.com',
];

const isGenericImage = (src = '') => {
  if (!src || typeof src !== 'string') return true;
  const value = src.toLowerCase();
  return GENERIC_IMAGE_HOSTS.some((host) => value.includes(host));
};

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const categoryType = (product = {}) => {
  const text = `${product.majorCategory || ''} ${product.subcategory || ''} ${product.name || ''} ${product.tags?.join?.(' ') || ''}`.toLowerCase();
  if (/headphone|earbud|speaker|audio|wearable|watch|fitness|microphone/.test(text)) return 'audio';
  if (/gaming|console|controller|playstation|xbox|nintendo|streaming|tv|television|monitor/.test(text)) return 'gaming';
  if (/phone|iphone|galaxy|pixel|smartphone|tablet|ipad|power bank|charger|mobile/.test(text)) return 'mobile';
  return 'computer';
};

const fallbackSvg = (product = {}) => {
  const label = escapeXml([product?.brand, product?.name].filter(Boolean).join(' · ') || 'Product photo unavailable');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f4f7fb"/><rect x="245" y="145" width="310" height="220" rx="24" fill="#dce5f0"/><path d="M305 310l55-62 55 55 42-43 78 92H305z" fill="#aebed2"/><circle cx="370" cy="215" r="22" fill="#9aadc3"/><text x="400" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#30445e">Product photo unavailable</text><text x="400" y="452" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#71829a">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const isGenericProductImage = isGenericImage;

export default function ProductImage({ product, className = '', priority = false, showGallery = false, enableZoom = showGallery }) {
  const images = useMemo(
    () => (Array.isArray(product?.images) ? product.images : []).filter((src) => !isGenericImage(src)),
    [product?.images]
  );
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const [zoomed, setZoomed] = useState(false);
  const productLabel = [product?.brand, product?.name, product?.model].filter(Boolean).join(' ') || 'VOLTIX product';
  const fallback = useMemo(() => fallbackSvg(product), [product]);
  const current = images[index];

  useEffect(() => {
    setIndex(0);
    setFailed(false);
    setFailedImages(new Set());
    setZoomed(false);
  }, [product?._id, product?.name, product?.model]);

  useEffect(() => {
    if (!zoomed) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setZoomed(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const handleImageError = () => {
    if (!current) {
      setFailed(true);
      return;
    }
    setFailedImages((previous) => new Set(previous).add(current));
    if (index < images.length - 1) {
      setIndex((value) => value + 1);
    } else {
      setFailed(true);
    }
  };

  const selectImage = (imageIndex) => {
    setIndex(imageIndex);
    setFailed(false);
  };

  const displaySrc = failed || !current ? fallback : current;
  const canZoom = enableZoom && !failed && Boolean(current);

  return (
    <>
      <div className={`voltix-image ${className}`}>
        <div
          className={`voltix-image-main ${canZoom ? 'zoomable' : ''}`}
          onClick={() => canZoom && setZoomed(true)}
          role={canZoom ? 'button' : undefined}
          tabIndex={canZoom ? 0 : undefined}
          onKeyDown={(event) => {
            if (canZoom && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              setZoomed(true);
            }
          }}
          aria-label={canZoom ? `Zoom ${productLabel}` : undefined}
        >
          <img
            src={displaySrc}
            alt={productLabel}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={failed ? undefined : handleImageError}
          />
          {canZoom && <span className="zoom-hint">Click to zoom</span>}
        </div>

        {showGallery && images.length > 1 && (
          <div className="voltix-thumbs" aria-label="Product image gallery">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                className={i === index ? 'active' : ''}
                onClick={() => selectImage(i)}
                aria-label={`View product image ${i + 1}`}
              >
                <img
                  src={failedImages.has(src) ? fallback : src}
                  alt={`${productLabel}, image ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoomed && current && !failed && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`${productLabel} enlarged image`} onClick={() => setZoomed(false)}>
          <button type="button" className="image-lightbox-close" onClick={() => setZoomed(false)} aria-label="Close enlarged image">×</button>
          <img src={current} alt={productLabel} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  );
}
