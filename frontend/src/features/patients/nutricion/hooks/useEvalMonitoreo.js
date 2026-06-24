import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { updateNutritionHistory } from '@services/apiNutritionHistory'
import { toastApiError } from '@lib/ApiError'

// Quita campos de la DB (id, historia_paciente_id) y convierte fecha dayjs → ISO.
function cleanRow({ id: _id, historia_paciente_id: _hpid, ...rest }) {
  return {
    ...rest,
    ...(rest.fecha !== undefined && {
      fecha: rest.fecha && dayjs.isDayjs(rest.fecha) ? rest.fecha.format('YYYY-MM-DD') : rest.fecha,
    }),
  }
}

// El PATCH reemplaza la relación completa (delete + recreate), reasignando IDs
// autoincrement en el orden del array. currentRows llega ordenado id desc (más
// nuevos primero), así que lo invertimos para que el payload vaya de más antiguo
// a más nuevo: el nuevo registro queda al final con el ID más alto y el orden
// id desc del backend lo muestra primero. NO quitar el reverse — es load-bearing.
function buildUpdatedRows(currentRows, formData, editId) {
  const newRow = cleanRow(formData)
  const asc = [...currentRows].reverse()
  return editId
    ? asc.map((r) => (r.id === editId ? newRow : cleanRow(r)))
    : [...asc.map(cleanRow), newRow]
}

export function useEvalMonitoreo(historiaId) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['nutrition-history', historiaId] })
    queryClient.invalidateQueries({ queryKey: ['nutrition-history'] })
  }

  // Una sola mutación: el campo (arrayName) y el mensaje varían por tipo de eval.
  const mutation = useMutation({
    mutationFn: ({ arrayName, rows }) => updateNutritionHistory(historiaId, { [arrayName]: rows }),
    onSuccess: (_data, { successMsg }) => {
      toast.success(successMsg)
      invalidate()
    },
    onError: toastApiError,
  })

  function saveSueno({ currentRows, formData, editId }) {
    return mutation.mutateAsync({
      arrayName: 'eval_cal_sueno',
      rows: buildUpdatedRows(currentRows, formData, editId),
      successMsg: 'Evaluación de sueño guardada',
    })
  }

  function saveActFisica({ currentRows, formData, editId }) {
    return mutation.mutateAsync({
      arrayName: 'eval_act_fisica_nutricion',
      rows: buildUpdatedRows(currentRows, formData, editId),
      successMsg: 'Evaluación de actividad física guardada',
    })
  }

  return {
    saveSueno,
    isSavingSueno: mutation.isPending,
    saveActFisica,
    isSavingActFisica: mutation.isPending,
  }
}
