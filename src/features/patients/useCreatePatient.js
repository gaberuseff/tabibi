import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPatient } from "../../services/apiPatients"

export default function useCreatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] })
    },
  })
}
