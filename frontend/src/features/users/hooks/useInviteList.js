import { useState } from 'react'
import { toast } from 'sonner'

const UABC_DOMAIN = '@uabc.edu.mx'

// Maneja el estado local de la lista de invitaciones (antes de enviarlas al
// backend). Expone add/edit/delete + el "modo edición" para pre-poblar el form.
export default function useInviteList({ resolveEmail, setIsUabcDomain, initialArea = '' }) {
  const [users, setUsers] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [role, setRole] = useState('pasante')
  const [area, setArea] = useState(initialArea)

  const isEditMode = Boolean(idEdit)

  // El rol admin nunca lleva área; el resto conserva la seleccionada.
  const resolveInviteArea = (r, a) => (r === 'admin' ? null : a)

  function reset() {
    setRole('pasante')
    setArea(initialArea)
    setIsUabcDomain(true)
    setIdEdit('')
  }

  function startEdit(user, setFormValue) {
    const isUabc = user.email.endsWith(UABC_DOMAIN)
    setIdEdit(user.email)
    setRole(user.role)
    setArea(user.area ?? initialArea)
    setIsUabcDomain(isUabc)
    setFormValue('email', isUabc ? user.email.replace(UABC_DOMAIN, '') : user.email)
  }

  function remove(email) {
    setUsers((prev) => prev.filter((u) => u.email !== email))
    reset()
  }

  function upsert(rawEmail) {
    const fullEmail = resolveEmail(rawEmail)

    if (isEditMode) {
      if (users.some((u) => u.email === fullEmail && u.email !== idEdit)) {
        toast.error('Este correo ya ha sido agregado a la lista')
        return false
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.email === idEdit
            ? { email: fullEmail, role, area: resolveInviteArea(role, area), status: 'pendiente' }
            : u
        )
      )
      reset()
      return true
    }

    if (users.some((u) => u.email === fullEmail)) {
      toast.error('Este correo ya ha sido agregado a la lista')
      return false
    }
    setUsers((prev) => [
      { email: fullEmail, role, area: resolveInviteArea(role, area), status: 'pendiente' },
      ...prev,
    ])
    reset()
    return true
  }

  return {
    users,
    role,
    setRole,
    area,
    setArea,
    idEdit,
    isEditMode,
    upsert,
    remove,
    startEdit,
    clear: () => setUsers([]),
  }
}
