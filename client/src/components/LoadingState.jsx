export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-5">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-purple-600" />
        <span className="font-medium text-slate-600">{label}</span>
      </div>
    </div>
  );
}
