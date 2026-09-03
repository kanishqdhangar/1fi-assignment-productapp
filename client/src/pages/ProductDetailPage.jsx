import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import VariantSelector from "../components/VariantSelector";
import EmiPlanList from "../components/EmiPlanList";
import ProceedButton from "../components/ProceedButton";
import { fetchProduct, fetchVariantEmiPlans } from "../api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [emiPlans, setEmiPlans] = useState([]);
  const [emiStatus, setEmiStatus] = useState("idle");
  const [emiError, setEmiError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // 1. Load product + variants
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setStatus("loading");
        setError("");
        setSuccessMessage("");
        setSelectedPlanId(null);
        setEmiPlans([]);

        const data = await fetchProduct(slug);

        if (!active) return;

        setProduct(data);

        const defaultVariant =
          data.variants.find((variant) => variant.isDefault) ??
          data.variants[0];

        setSelectedVariantId(defaultVariant?.id ?? null);

        // Initial EMI plans come from the product API.
        setEmiPlans(defaultVariant?.emiPlans ?? []);
        setEmiStatus("success");

        setStatus("success");
      } catch (err) {
        if (active) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  // --------------------------------------------------
  // 2. Fetch EMI plans whenever variant changes
  // --------------------------------------------------

  useEffect(() => {
    if (!product || !selectedVariantId) return;

    const defaultVariant =
      product.variants.find((variant) => variant.isDefault) ??
      product.variants[0];

    // Don't make another API request for the initial
    // default variant because its plans already came
    // with GET /api/products/:slug.
    if (defaultVariant?.id === selectedVariantId) {
      setEmiPlans(defaultVariant.emiPlans ?? []);
      setEmiStatus("success");
      return;
    }

    let active = true;

    async function loadVariantEmiPlans() {
      try {
        setEmiStatus("loading");
        setEmiError("");

        // Clear currently selected EMI plan.
        setSelectedPlanId(null);
        setSuccessMessage("");

        // Remove old plans while new ones are loading.
        setEmiPlans([]);

        const plans = await fetchVariantEmiPlans(
          slug,
          selectedVariantId
        );

        if (!active) return;

        setEmiPlans(plans);
        setEmiStatus("success");
      } catch (err) {
        if (!active) return;

        setEmiPlans([]);
        setEmiError(err.message);
        setEmiStatus("error");
      }
    }

    loadVariantEmiPlans();

    return () => {
      active = false;
    };
  }, [slug, selectedVariantId, product]);

  // --------------------------------------------------
  // 3. Get selected variant
  // --------------------------------------------------

  const selectedVariant = useMemo(
    () =>
      product?.variants.find(
        (variant) => variant.id === selectedVariantId
      ),
    [product, selectedVariantId]
  );

  // --------------------------------------------------
  // 4. Get selected EMI plan
  // --------------------------------------------------

  const selectedPlan = useMemo(
    () =>
      emiPlans.find(
        (plan) => plan.id === selectedPlanId
      ) ?? null,
    [emiPlans, selectedPlanId]
  );

  // --------------------------------------------------
  // 5. Variant selection
  // --------------------------------------------------

  function handleVariantChange(variantId) {
    setSelectedVariantId(variantId);

    // Immediately clear previous EMI selection.
    setSelectedPlanId(null);

    // Clear old plans while the API request runs.
    setEmiPlans([]);

    setEmiError("");
    setSuccessMessage("");
    setEmiStatus("loading");
  }

  // --------------------------------------------------
  // 6. Proceed
  // --------------------------------------------------

  function handleProceed() {
    if (!selectedPlan || !selectedVariant) return;

    setSuccessMessage(
      `Great! Proceeding with ${currency.format(
        selectedPlan.monthlyAmount
      )} × ${selectedPlan.tenureMonths} months for ${selectedVariant.label}.`
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (status === "loading") {
    return (
      <LoadingState label="Loading product and EMI plans..." />
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (status === "error") {
    return <ErrorState message={error} />;
  }

  // --------------------------------------------------
  // Safety check
  // --------------------------------------------------

  if (!product || !selectedVariant) {
    return (
      <ErrorState
        message="This product does not have a valid variant."
      />
    );
  }

  const discount = Math.max(
    selectedVariant.mrp - selectedVariant.price,
    0
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-purple-700"
      >
        ← Back to products
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

        {/* ------------------------------------------- */}
        {/* Product section */}
        {/* ------------------------------------------- */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7 lg:sticky lg:top-5 lg:h-fit">

          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={selectedVariant.imageUrl}
              alt={`${product.name} ${selectedVariant.label}`}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="mt-6">

            <p className="text-xs font-bold uppercase tracking-widest text-purple-600">
              {product.brand}
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {selectedVariant.label}
            </p>

            <div className="mt-5">
              <VariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariantId}
                onSelect={handleVariantChange}
              />
            </div>

          </div>
        </section>

        {/* ------------------------------------------- */}
        {/* EMI section */}
        {/* ------------------------------------------- */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">

          {/* Price */}

          <div className="border-b border-slate-100 pb-5">

            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">

              <p className="text-3xl font-black tracking-tight text-slate-950">
                {currency.format(selectedVariant.price)}
              </p>

              <p className="pb-1 text-sm text-slate-400 line-through">
                {currency.format(selectedVariant.mrp)}
              </p>

              {discount > 0 && (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                  Save {currency.format(discount)}
                </span>
              )}

            </div>

            <p className="mt-2 text-sm text-slate-500">
              {product.description}
            </p>

          </div>

          {/* EMI plans */}

          <div className="mt-6">

            {emiStatus === "loading" ? (

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-purple-600" />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Loading EMI plans
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Fetching plans for{" "}
                    {selectedVariant.label}
                  </p>
                </div>

              </div>

            ) : emiStatus === "error" ? (

              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

                <p className="text-sm font-bold text-red-800">
                  Could not load EMI plans
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {emiError}
                </p>

              </div>

            ) : (

              <EmiPlanList
                plans={emiPlans}
                selectedPlanId={selectedPlanId}
                onSelect={(planId) => {
                  setSelectedPlanId(planId);
                  setSuccessMessage("");
                }}
              />

            )}

          </div>

          {/* Proceed */}

          <div className="mt-5">

            <ProceedButton
              plan={selectedPlan}
              onProceed={handleProceed}
            />

          </div>

          {/* Success message */}

          {successMessage && (
            <div
              role="status"
              className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-800"
            >
              {successMessage}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}