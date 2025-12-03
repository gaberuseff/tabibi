import { useCallback } from "react"
import toast from "react-hot-toast"
import useUpdateAppointment from "./useUpdateAppointment"

/**
 * Hook to handle appointment update with validation and error handling
 * Encapsulates all logic for updating appointments including:
 * - Data validation
 * - Price validation
 * - Toast notifications
 * - Success/Error callbacks
 */
export default function useUpdateAppointmentHandler() {
    const { mutate: updateAppointment, isPending } = useUpdateAppointment()

    /**
     * Validate appointment update data
     * @param {Object} data - Update data
     * @returns {string|null} Error message or null if valid
     */
    const validateUpdateData = useCallback((data) => {
        if (!data.date || isNaN(new Date(data.date).getTime())) {
            return "تاريخ ووقت الموعد غير صحيح"
        }

        if (
            data.price === "" ||
            isNaN(parseFloat(data.price)) ||
            parseFloat(data.price) < 0
        ) {
            return "سعر الحجز مطلوب ويجب أن يكون رقمًا موجبًا"
        }

        return null
    }, [])

    /**
     * Handle appointment update
     * @param {string} appointmentId - Appointment ID
     * @param {Object} data - Update data
     * @param {Function} onSuccess - Success callback
     * @returns {void}
     */
    const handleAppointmentUpdate = useCallback(
        (appointmentId, data, onSuccess) => {
            const validationError = validateUpdateData(data)

            if (validationError) {
                toast.error(validationError)
                return
            }

            const payload = {
                date: data.date,
                notes: data.notes,
                price:
                    typeof data.price === "string"
                        ? parseFloat(data.price)
                        : data.price,
            }

            updateAppointment(
                { id: appointmentId, ...payload },
                {
                    onSuccess: () => {
                        onSuccess?.()
                    },
                }
            )
        },
        [updateAppointment, validateUpdateData]
    )

    return {
        handleAppointmentUpdate,
        isPending,
    }
}
