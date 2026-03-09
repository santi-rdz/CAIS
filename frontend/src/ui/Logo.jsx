import caisLogo from '@assets/images/logo-cais.png'
import useUser from '@features/users/useUser'

export default function Logo({ children, isExpanded = true }) {
  return (
    <div
      className={`flex items-center transition-all duration-300 ease-in-out ${isExpanded ? ' gap-2' : 'gap-0'}`}
    >
      <img src={caisLogo} className="w-12" alt="" />
      <div
        className={`flex flex-col overflow-hidden ${isExpanded ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  )
}

Logo.Heading = function Heading() {
  return (
    <h1 className="font-lato text-2 leading-none tracking-tight text-green-800">
      CAIS
    </h1>
  )
}

Logo.Area = function Area() {
  const { user } = useUser()
  return (
    <span className="text-7 mt-1 inline-flex w-fit items-center rounded-full bg-green-50 px-2 py-0.5 font-medium tracking-wide text-green-700 capitalize">
      {user?.area.toLowerCase()}
    </span>
  )
}
