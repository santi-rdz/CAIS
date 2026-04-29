import { HiCheck, HiXMark } from 'react-icons/hi2'
import { PASSWORD_REQUIREMENTS as REQUIREMENTS } from '@cais/shared/schemas/fields'

function RequirementItem({ met, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${met ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
      >
        {met ? (
          <HiCheck strokeWidth={2} size={12} />
        ) : (
          <HiXMark strokeWidth={2} size={12} />
        )}
      </span>
      <span className={`text-5 ${met ? 'text-green-700' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}

export default function PasswordRequirements({ password = '' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
      <p className="text-5 mb-3 font-semibold text-gray-700">
        Tu contraseña debe contener:
      </p>
      <div className="space-y-2">
        {REQUIREMENTS.map((req) => (
          <RequirementItem
            key={req.label}
            met={req.test(password)}
            label={req.label}
          />
        ))}
      </div>
    </div>
  )
}
