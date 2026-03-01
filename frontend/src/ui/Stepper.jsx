import { HiCheck } from 'react-icons/hi2'

export default function Stepper({ steps, current, setCurrStep, gap = '' }) {
  return (
    <div className="mx-4 flex" style={{ gap }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isCompleted = current > i
        const isActive = current === i
        return (
          <div key={i} className={`flex flex-1 items-center ${isLast ? 'grow-0' : ''}`} style={{ gap }}>
            <div className="relative">
              <button
                onClick={() => setCurrStep(i)}
                className={`flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform ${isActive ? 'scale-105 ring-2 ring-green-800 ring-offset-2' : ''} ${isActive || isCompleted ? 'bg-green-800 text-white' : 'bg-gray-200 text-neutral-500'}`}
              >
                {isCompleted ? <HiCheck strokeWidth={1} /> : i + 1}
              </button>
              <p
                className={`text-6 absolute left-1/2 mt-2 max-w-[10ch] -translate-x-1/2 text-center text-wrap text-gray-500 ${isActive || isCompleted ? 'text-green-800' : ''}`}
              >
                {step}
              </p>
            </div>
            {!isLast && (
              <div
                className={`h-1 w-full transition-colors duration-500 ease-in-out ${isCompleted ? 'bg-green-800' : 'bg-gray-200'} `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
