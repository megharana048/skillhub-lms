function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export default Loader;
