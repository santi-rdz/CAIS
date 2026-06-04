import { useState } from 'react'
import { toast } from 'sonner'

const UABC_DOMAIN = '@uabc.edu.mx'

// Maneja el estado local de la lista de invitaciones (antes de enviarlas al
// backend). Expone add/edit/delete + el "modo edición" para pre-poblar el form.
export default function useInviteList({ resolveEmail, setIsUabcDomain }) {
  const [users, setUsers] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [role, setRole] = useState('pasante')

  const isEditMode = Boolean(idEdit)

  function reset() {
    setRole('pasante')
    setIsUabcDomain(true)
    setIdEdit('')
  }

  function startEdit(user, setFormValue) {
    const isUabc = user.email.endsWith(UABC_DOMAIN)
    setIdEdit(user.email)
    setRole(user.role)
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
        prev.map((u) => (u.email === idEdit ? { email: fullEmail, role, status: 'pendiente' } : u))
      )
      reset()
      return true
    }

    if (users.some((u) => u.email === fullEmail)) {
      toast.error('Este correo ya ha sido agregado a la lista')
      return false
    }
    setUsers((prev) => [{ email: fullEmail, role, status: 'pendiente' }, ...prev])
    reset()
    return true
  }

  return {
    users,
    role,
    setRole,
    idEdit,
    isEditMode,
    upsert,
    remove,
    startEdit,
    clear: () => setUsers([]),
  }
}
