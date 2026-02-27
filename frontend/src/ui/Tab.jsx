import { createContext, useContext, useState } from 'react'
import Heading from './Heading'
import ModalHeading from './ModalHeading'

const TabContext = createContext()

export default function Tab({ children, defaultTab, options }) {
  const defaultOption = defaultTab ? options.find((op) => op.value === defaultTab) : options[0]
  const [activeOption, setActiveOption] = useState(defaultOption)

  return (
    <TabContext.Provider value={{ activeOption, setActiveOption, options }}>
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
  const { options } = useContext(TabContext)

  return (
    <div className="shrink-0 px-8 py-2 pt-6">
      <nav className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {options.map((option) => (
          <Tab.Button key={option.value} option={option} />
        ))}
      </nav>
    </div>
  )
}

Tab.Button = function TabButton({ option }) {
  const { activeOption, setActiveOption } = useContext(TabContext)

  const isActive = activeOption.value === option.value

  return (
    <button
      onClick={() => setActiveOption(option)}
      className={`flex-1 cursor-pointer rounded py-2 text-sm font-medium duration-300 ${
        isActive ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
      }`}
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
