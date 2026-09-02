import EmiPlanCard from "./EmiPlanCard";

export default function EmiPlanList({
  plans,
  selectedPlanId,
  onSelect,
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-slate-900">
          EMI plans backed by mutual funds
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select one plan that works for you.
        </p>
      </div>

      <div className="space-y-2.5">
        {plans.map((plan) => (
          <EmiPlanCard
            key={plan.id}
            plan={plan}
            selected={plan.id === selectedPlanId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
