export function AdminStatusNotice({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
      {message}
    </div>
  );
}
