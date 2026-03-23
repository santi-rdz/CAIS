export default function MetaChip({ icon, value }) {
  return (
    <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-zinc-600">
      <span className="text-zinc-400">{icon}</span>
      {value}
    </span>
  )
}
