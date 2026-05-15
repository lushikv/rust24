export function AdminSubmitButton({ children = "Save" }: { children?: string }) {
  return (
    <button
      className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
      type="submit"
    >
      {children}
    </button>
  );
}
