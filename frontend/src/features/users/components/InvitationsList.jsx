import { useState } from 'react'
import TabLayout from '@ui/TabLayout'
import InvitationCard from '@features/users/components/InvitationCard'
import InvitationsEmptyState from '@features/users/components/InvitationsEmptyState'

export default function InvitationsList({ users, idEdit, onEdit, onDelete }) {
  const [layout, setLayout] = useState('list')
  const isGrid = layout === 'grid'

  if (users.length === 0) {
    return (
      <div className="border-t border-t-gray-100 pt-8">
        <InvitationsEmptyState />
      </div>
    )
  }

  return (
    <div className="border-t border-t-gray-100 pt-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-4 font-semibold text-gray-800">
          Invitaciones{' '}
          <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {users.length}
          </span>
        </p>
        <TabLayout layout={layout} setLayout={setLayout} />
      </div>

      <ul
        className={`${isGrid ? 'grid grid-cols-2 content-start ' : 'flex flex-col '} max-h-64 gap-4 overflow-y-auto`}
      >
        {users.map((user) => (
          <InvitationCard
            key={user.email}
            user={user}
            isEditing={idEdit === user.email}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}
