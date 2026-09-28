export default function RatingStars({ value = 0, count, interactive = false, onChange }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const label = rating > 0 ? `${rating.toFixed(1)} out of 5 stars` : 'No rating yet';
  return (
    <span className="stars" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        if (interactive) {
          return (
            <button
              type="button"
              key={i}
              className="star"
              onClick={() => onChange?.(i)}
              aria-label={`Rate ${i} out of 5 stars`}
              aria-pressed={rating === i}
            >
              <span className="star-base" aria-hidden="true">★</span>
              <span className="star-fill" aria-hidden="true" style={{ width: `${fill * 100}%` }}>★</span>
            </button>
          );
        }
        return (
          <span className="star" key={i} aria-hidden="true">
            <span className="star-base">★</span>
            <span className="star-fill" style={{ width: `${fill * 100}%` }}>★</span>
          </span>
        );
      })}
      <small>{rating > 0 ? rating.toFixed(1) : 'No rating'}{count != null ? ` (${count})` : ''}</small>
    </span>
  );
}
