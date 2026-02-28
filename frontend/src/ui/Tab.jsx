import { createContext, useContext, useState } from 'react'
import Heading from './Heading'
import ModalHeading from './ModalHeading'

const TabContext = createContext()

export default function Tab({ children, defaultTab, options, variant = 'primary' }) {
  const defaultOption = defaultTab ? options.find((op) => op.value === defaultTab) : options[0]
  const [activeOption, setActiveOption] = useState(defaultOption)

  return (
    <TabContext.Provider value={{ activeOption, setActiveOption, options, variant }}>
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </TabContext.Provider>
  )
}

Tab.Header = function TabHeader({ children }) {
  return <ModalHeading className="shrink-0">{children}</ModalHeading>
}

Tab.Title = function TabTitle() {
  const { activeOption } = useContext(TabContext)
  return <Heading as="h2">{activeOption.title}</Heading>
}

Tab.Description = function TabDescription() {
  const { activeOption } = useContext(TabContext)
  return <p className="text-sm text-gray-500">{activeOption.desc}</p>
}

Tab.Options = function TabOptions() {
  const { options, variant } = useContext(TabContext)
  const tabStyle = variant === 'primary' ? 'bg-gray-100  mt-6 rounded-lg' : 'bg-gray-50 mt-4 w-54 rounded-md'
  return (
    <nav className={`mx-8 flex gap-1 p-1 ${tabStyle}`}>
      {options.map((option) => (
        <Tab.Button key={option.value} option={option} />
      ))}
    </nav>
  )
}

Tab.Button = function TabButton({ option }) {
  const { activeOption, setActiveOption, variant } = useContext(TabContext)

  const isActive = activeOption.value === option.value
  const buttonStyle =
    variant === 'primary'
      ? `${isActive ? 'bg-green-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`
      : `text-gray-500 ${isActive ? 'bg-white text-green-800 shadow-sm' : ' hover:bg-gray-200'}`
  return (
    <button
      onClick={() => setActiveOption(option)}
      className={`flex-1 cursor-pointer rounded py-2 text-sm duration-300 ${buttonStyle}`}
    >
      {option.label}
    </button>
  )
}

Tab.Content = function TabContent({ onClose }) {
  const { activeOption } = useContext(TabContext)
  const ActiveComponent = activeOption.component

  return <div className="h-[500px] w-2xl flex-1 overflow-y-auto">{ActiveComponent(onClose)}</div>
}
