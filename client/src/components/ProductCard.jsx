import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
          {product.brand}
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">{product.name}</h2>
        <p className="mt-3 text-sm text-slate-500">Starting from</p>
        <p className="mt-0.5 text-xl font-extrabold text-slate-900">
          {currency.format(product.startingPrice)}
        </p>
        <p className="mt-4 text-sm font-semibold text-purple-700">
          View EMI plans →
        </p>
      </div>
    </Link>
  );
}
