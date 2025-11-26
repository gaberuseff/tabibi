import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createVisit } from "../../services/apiVisits"

export default function useCreateVisit() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createVisit,
        onSuccess: () => {
            // Invalidate visits queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["visits"] })
            toast.success("تم إضافة الكشف بنجاح")
        },
        onError: (error) => {
            toast.error(error.message || "فشل في إضافة الكشف")
        },
    })
}