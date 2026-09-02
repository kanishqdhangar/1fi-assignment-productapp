const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProceedButton({ plan, onProceed }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
      <button
        type="button"
        disabled={!plan}
        onClick={onProceed}
        className="w-full rounded-2xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {plan
          ? `Proceed with ${currency.format(plan.monthlyAmount)} × ${plan.tenureMonths} months`
          : "Select an EMI plan to proceed"}
      </button>
    </div>
  );
}
