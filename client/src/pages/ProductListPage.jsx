import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchProducts } from "../api";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setStatus("loading");
        const data = await fetchProducts();

        if (active) {
          setProducts(data);
          setStatus("success");
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <LoadingState label="Loading products..." />;
  }

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
            Shop smarter
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Smartphones with flexible EMI plans
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Browse products and choose an EMI plan that fits your budget.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No products are available yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
