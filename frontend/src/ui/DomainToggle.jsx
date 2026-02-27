import { HiOutlineXMark, HiOutlinePlus } from 'react-icons/hi2'
import Button from './Button'

export default function DomainToggle({ isDomain, setIsDomain, className, style }) {
  return (
    <Button
      style={style}
      onClick={() => setIsDomain(!isDomain)}
      size="md"
      variant="outline"
      type="button"
      className={`group ${isDomain ? 'bg-white' : ' bg-white/80 text-neutral-400'} ${className}`}
    >
      <span className={`${isDomain ? '' : 'line-through'}`}>@uabc.edu.mx</span>
      <div
        type="button"
        data-testid="toggle-domain"
        className="pointer-events-none absolute -top-1 -right-1 inline-flex size-5 scale-75 cursor-pointer items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-[opacity_transform] duration-300 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 active:scale-80"
      >
        {isDomain ? <HiOutlineXMark /> : <HiOutlinePlus className="bg-white text-black" />}
      </div>
    </Button>
  )
}
