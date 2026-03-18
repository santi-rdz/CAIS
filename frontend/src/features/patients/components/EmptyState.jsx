export default function EmptyState({ icon, message, hint }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2 py-8 text-center">
      <span className="text-zinc-300">{icon}</span>
      <p className="text-5 font-medium text-zinc-500">{message}</p>
      <p className="text-6 text-zinc-400">{hint}</p>
    </div>
  )
}
