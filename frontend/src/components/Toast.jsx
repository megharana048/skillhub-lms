function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  const toastClasses =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-4 rounded-xl border px-4 py-3 shadow-xl ${toastClasses}`}
    >
      <span className="text-sm font-semibold">
        {message}
      </span>

      <button
        type="button"
        onClick={onClose}
        className="text-lg leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;