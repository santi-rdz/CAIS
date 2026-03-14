const headingStyle = {
  h1: 'text-1 font-medium font-lato',
  h2: 'text-2 font-medium font-lato',
  h3: 'text-3 font-medium font-lato',
  h4: 'text-4 font-medium font-lato',
}

export default function Heading({
  children,
  as = 'h1',
  showBar = false,
  required = null,
  className = '',
}) {
  const Tag = as

  return (
    <Tag className={`flex items-center gap-2 ${headingStyle[as]} ${className}`}>
      {showBar && (
        <div
          className={`h-4 w-1 rounded-full ${required ? 'bg-green-800' : 'bg-gray-400'}`}
        ></div>
      )}
      {children}
    </Tag>
  )
}
