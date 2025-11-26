import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAppointment } from "../../services/apiAppointments"
import toast from "react-hot-toast"

export default function useCreateAppointment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            toast.success("تم إضافة الموعد بنجاح")
        },
        onError: (error) => {
            console.error("Error in useCreateAppointment:", error)
            toast.error(error.message || "فشل إضافة الموعد")
        },
    })
}
