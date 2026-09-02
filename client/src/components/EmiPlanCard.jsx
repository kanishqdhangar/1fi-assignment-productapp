const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function EmiPlanCard({ plan, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={selected}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-purple-600 bg-purple-50 shadow-sm ring-2 ring-purple-100"
          : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
            selected ? "border-purple-600" : "border-slate-300"
          }`}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="font-bold text-slate-900">
              {currency.format(plan.monthlyAmount)} × {plan.tenureMonths} months
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {plan.interestRate === 0
                ? "0% interest"
                : `${plan.interestRate}% interest`}
            </p>
          </div>

          <p className="mt-1 text-xs font-medium text-green-600">
            Additional cashback of {currency.format(plan.cashback)}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Funded by {plan.fundedBy}
          </p>
        </div>
      </div>
    </button>
  );
}
