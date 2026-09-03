# 1Fi SDE1 Assignment — EMI Product Page

A full-stack EMI product catalog built for the 1Fi SDE1 assignment. Product, variant, pricing, images, and EMI-plan data are stored in MongoDB and served through an Express API; the React frontend consumes that API.

## Tech stack

- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Deployment target:** Frontend on Vercel; backend on Render; database on MongoDB Atlas

## Project structure

```text
1fi-emi-product-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/productsController.js
│   │   ├── models/
│   │   ├── routes/products.js
│   │   ├── seed/seed.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Database schema

```text
Product (1) ────────────< Variant (1) ────────────< EmiPlan
```

### `products`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | MongoDB primary key |
| `name` | String | Product name |
| `slug` | String, unique | Used in `/products/:slug` |
| `brand` | String | Brand name |
| `description` | String | Short product description |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

### `variants`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | MongoDB primary key |
| `productId` | ObjectId | Reference to `products` |
| `label` | String | Human-readable variant |
| `storage` | String | Optional storage |
| `color` | String | Optional color |
| `mrp` | Number | Maximum retail price |
| `price` | Number | Discounted price |
| `imageUrl` | String | Product image |
| `isDefault` | Boolean | Default selected variant |

### `emi_plans`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | MongoDB primary key |
| `variantId` | ObjectId | Reference to `variants` |
| `tenureMonths` | Number | EMI tenure |
| `monthlyAmount` | Number | Monthly installment |
| `interestRate` | Number | Annual interest rate |
| `cashback` | Number | Cashback amount |
| `fundedBy` | String | Defaults to `Mutual Fund` |

The seed creates **3 products**, **2 variants per product**, and **7 EMI plans per variant** for the tenure ladder `3, 6, 12, 24, 36, 48, 60` months. Shorter plans use 0% interest; longer plans use 10.5% interest; each plan has a flat ₹7,500 cashback.

## Backend setup

### 1. Start MongoDB

Use a local MongoDB server or MongoDB Atlas.

### 2. Configure environment

```bash
cd server
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/onefi_emi
FRONTEND_URL=http://localhost:5173
```

For Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Install and seed

```bash
npm install
npm run seed
```

### 4. Run the API

```bash
npm run dev
```

Backend runs by default at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/health
```

## Frontend setup

```bash
cd client
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then:

```bash
npm install
npm run dev
```

Frontend runs by default at:

```text
http://localhost:5173
```

## API endpoints

### `GET /api/products`

Returns a lightweight product list.

Example:

```json
[
  {
    "id": "generated-mongodb-id",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "thumbnail": "https://images.unsplash.com/...",
    "startingPrice": 127400
  }
]
```

### `GET /api/products/:slug`

Returns product details with all variants.

For the initial product load, EMI plans are returned **only for the default variant** (`isDefault: true`). EMI plans for other variants are fetched separately using the variant EMI-plan endpoint when the user switches variants.

Example:

```json
{
  "id": "generated-mongodb-id",
  "name": "iPhone 17 Pro",
  "slug": "iphone-17-pro",
  "brand": "Apple",
  "description": "A premium smartphone with a titanium-inspired design and a high-performance camera system.",
  "variants": [
    {
      "id": "generated-variant-id",
      "label": "256GB / Silver",
      "storage": "256GB",
      "color": "Silver",
      "mrp": 134900,
      "price": 127400,
      "imageUrl": "https://images.unsplash.com/...",
      "isDefault": true,
      "emiPlans": [
        {
          "id": "generated-plan-id",
          "tenureMonths": 3,
          "monthlyAmount": 42467,
          "interestRate": 0,
          "cashback": 7500,
          "fundedBy": "Mutual Fund"
        }
      ]
    },
    {
      "id": "generated-orange-variant-id",
      "label": "256GB / Orange",
      "storage": "256GB",
      "color": "Orange",
      "mrp": 134900,
      "price": 127400,
      "imageUrl": "https://images.unsplash.com/...",
      "isDefault": false
    }
  ]
}
```

The remaining seeded variants/plans follow the same response shape.

### `GET /api/products/:slug/variants/:variantId/emi-plans`

Returns only the EMI plans belonging to a specific variant.

The frontend calls this endpoint whenever the user switches from the default variant to another variant, so the EMI plans are loaded dynamically for the selected variant.

Example:

```json
[
  {
    "id": "generated-plan-id",
    "tenureMonths": 3,
    "monthlyAmount": 42467,
    "interestRate": 0,
    "cashback": 7500,
    "fundedBy": "Mutual Fund"
  }
]
```

### Error responses

Unknown product:

```json
{
  "error": "Product not found"
}
```

Unknown variant:

```json
{
  "error": "Variant not found"
}
```

## Frontend behavior

- `/` displays all products from `GET /api/products`.
- `/products/:slug` displays product details from `GET /api/products/:slug`.
- The default variant is selected using the database `isDefault` field.
- The initial product API response includes EMI plans only for the default variant.
- Switching to another variant updates the image, MRP, and price immediately, then calls the variant EMI-plan endpoint to load that variant's EMI plans.
- A loading state is displayed while the new variant's EMI plans are being fetched.
- Switching back to the default variant can reuse the EMI plans already loaded from the initial product response.
- EMI plans use a radio-style single selection.
- The proceed button remains disabled until an EMI plan is selected.
- Proceeding shows an inline confirmation message only; there is no payment/order backend.
- Loading, empty, and API-error states are handled.
- The UI is responsive for mobile and desktop.

## Deployment

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow the Render service to connect to the cluster.
4. Copy the Atlas connection string into the Render `MONGODB_URI`.

### Backend on Render

Create a Render Web Service pointing at the repository's `server` directory.

Suggested settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Environment variables:

```env
MONGODB_URI=<your-atlas-uri>
FRONTEND_URL=https://<your-vercel-domain>
PORT=10000
```

Run the seed once after configuring the database:

```bash
npm run seed
```

### Frontend on Vercel

Create a Vercel project pointing at the repository's `client` directory.

Environment variable:

```env
VITE_API_BASE_URL=https://<your-render-backend>/api
```

Vite's production build command is:

```bash
npm run build
```

Output directory:

```text
dist
```

## Reference

The assignment reference page is Snapmint's iPhone 17 Pro EMI product page. The provided assignment specifically asks for product details, multiple variants, EMI plans, and a proceed action while keeping the data dynamic through a database/API.
