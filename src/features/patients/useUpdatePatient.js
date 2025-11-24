import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePatient } from "../../services/apiPatients"

export default function useUpdatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }) => updatePatient(id, values),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["patients"] })
      qc.invalidateQueries({ queryKey: ["patient"], exact: false })
    },
  })
}
