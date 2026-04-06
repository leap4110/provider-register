export function TestDataBadge() {
  if (process.env.NEXT_PUBLIC_SHOW_TEST_BANNER !== "true") return null;

  return (
    <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700">
      Test
    </span>
  );
}
