import { Link, Route, Routes } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Page not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
        >
          Back to products
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 text-lg font-black text-white">
              P
            </span>
            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-900">
                Product Store
              </p>
              <p className="text-xs text-slate-500">EMI plans backed by mutual funds</p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 hover:text-purple-700"
          >
            Products
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
