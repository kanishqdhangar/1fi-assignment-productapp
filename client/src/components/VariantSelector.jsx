export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Choose a variant</h2>
          <p className="mt-1 text-xs text-slate-500">
            Available in {variants.length} finishes
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => {
          const selected = variant.id === selectedVariantId;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              aria-pressed={selected}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                selected
                  ? "border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-purple-300"
              }`}
            >
              <span className="block font-semibold">{variant.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {variant.storage}
                {variant.color ? ` · ${variant.color}` : ""}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
