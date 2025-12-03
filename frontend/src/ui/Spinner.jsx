export default function Spinner() {
  return (
    <div className="mt-20 flex justify-center">
      <div
        className="animate-rotate inline-block aspect-square w-16 rounded-full"
        style={{
          background:
            'radial-gradient(farthest-side, #065f46 94%, #0000) top/10px 10px no-repeat, conic-gradient(#0000 30%, #065f46)',
          WebkitMask: 'radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0)',
        }}
      ></div>
    </div>
  )
}
