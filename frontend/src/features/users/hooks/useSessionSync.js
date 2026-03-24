import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export default function useSessionSync() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'session_event') {
        const { type } = JSON.parse(e.newValue)
        if (type === 'logout') {
          queryClient.clear()
          navigate('/login', { replace: true })
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [queryClient, navigate])
}
