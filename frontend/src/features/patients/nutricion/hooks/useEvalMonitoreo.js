import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { createEvalCalSueno, updateEvalCalSueno } from '@services/apiEvalCalSueno'
import { createEvalActFisica, updateEvalActFisica } from '@services/apiEvalActFisica'
import { toastApiError } from '@lib/ApiError'

// Quita campos de la DB (id, historia_paciente_id), convierte fecha dayjs → ISO
// y normaliza undefined → null. Esto último es clave: al vaciar un campo numérico
// en edición, Zod lo transforma a undefined y JSON.stringify lo descartaría, así
// que el PATCH nunca lo limpiaría. Enviarlo como null fuerza el borrado.
function cleanRow({ id: _id, historia_paciente_id: _hpid, fecha, ...rest }) {
  const normalized = Object.fromEntries(
    Object.entries(rest).map(([key, value]) => [key, value === undefined ? null : value])
  )
  if (fecha !== undefined) {
    normalized.fecha = fecha && dayjs.isDayjs(fecha) ? fecha.format('YYYY-MM-DD') : fecha
  }
  return normalized
}

// Cada evaluación es un recurso atómico: create → POST, edit → PATCH por id.
// La historia (que incluye los arreglos) se invalida para refrescar las tablas.
export function useEvalMonitoreo(historiaId) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['nutrition-history', historiaId] })
    queryClient.invalidateQueries({ queryKey: ['nutrition-history'] })
  }

  const suenoMutation = useMutation({
    mutationFn: ({ formData, editId }) =>
      editId
        ? updateEvalCalSueno(editId, cleanRow(formData))
        : createEvalCalSueno({ historia_paciente_id: historiaId, ...cleanRow(formData) }),
    onSuccess: () => {
      toast.success('Evaluación de sueño guardada')
      invalidate()
    },
    onError: toastApiError,
  })

  const actFisicaMutation = useMutation({
    mutationFn: ({ formData, editId }) =>
      editId
        ? updateEvalActFisica(editId, cleanRow(formData))
        : createEvalActFisica({ historia_paciente_id: historiaId, ...cleanRow(formData) }),
    onSuccess: () => {
      toast.success('Evaluación de actividad física guardada')
      invalidate()
    },
    onError: toastApiError,
  })

  return {
    saveSueno: suenoMutation.mutateAsync,
    isSavingSueno: suenoMutation.isPending,
    saveActFisica: actFisicaMutation.mutateAsync,
    isSavingActFisica: actFisicaMutation.isPending,
  }
}
