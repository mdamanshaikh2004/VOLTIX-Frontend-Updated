# VOLTIX Frontend

React + Vite frontend for the VOLTIX electronics marketplace.

## Features

- Responsive storefront with four electronics categories
- Search, filtering, sorting and pagination
- Price filter beginning at ₹5,000 with ₹5,000 steps
- Product details, technical specifications and real product-photo URLs
- Average rating and review count display
- Interactive five-star review form
- Verified-purchase review labels
- Wishlist and server-backed cart
- Protected checkout, orders and profile
- Stripe checkout redirect through the backend
- Login, registration email OTP, verification and password-reset OTP
- Admin dashboard and management screens
- Light/dark theme and accessible focus states

## Setup

```bash
npm install
```

Create `client/.env` only if the backend is hosted separately:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not put MongoDB, JWT, Redis, SMTP or Stripe secrets in the frontend environment.

## Development

```bash
npm run dev
```

Default Vite URL: `http://localhost:5173`.

## Production build

```bash
npm run build
```

Deploy the resulting `dist/` directory to your frontend/static host.

## API behavior

The frontend uses the existing backend API:

- Products: `/api/products`
- Product reviews: `/api/products/:id/reviews`
- Review edit/delete: `/api/reviews/:id`
- Cart: `/api/cart`
- Wishlist: `/api/wishlist`
- Orders: `/api/orders`
- Stripe checkout: `/api/payment/create-checkout-session`
- Authentication/OTP: `/api/auth/*`
- Admin: `/api/admin/*`

## Security

The backend is authoritative for authentication, authorization, prices, stock, cart totals, order totals and payment status. The frontend must never contain backend secrets.
