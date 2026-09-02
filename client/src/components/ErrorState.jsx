import { Link } from "react-router-dom";

export default function ErrorState({ message = "Unable to load data." }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl items-center justify-center px-5">
      <div className="w-full rounded-2xl border border-red-100 bg-white p-7 text-center shadow-soft">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-xl text-red-600">
          !
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          We couldn't load this page
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Go to products
        </Link>
      </div>
    </div>
  );
}
