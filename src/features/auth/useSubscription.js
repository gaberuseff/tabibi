import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelActiveSubscription, createSubscription, getActiveSubscription } from "../../services/apiSubscriptions";
import toast from "react-hot-toast";

export function useActiveSubscription(clinicId) {
    return useQuery({
        queryKey: ["activeSubscription", clinicId],
        queryFn: () => getActiveSubscription(clinicId),
        enabled: !!clinicId
    });
}

export function useCancelActiveSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clinicId) => cancelActiveSubscription(clinicId),
        onSuccess: (_, clinicId) => {
            // Don't show success message as it's not necessary for the user
            queryClient.invalidateQueries(["activeSubscription", clinicId]);
        },
        onError: (error) => {
            // We don't show an error here because it's expected that there might not be an active subscription
            console.log("No active subscription to cancel or error cancelling:", error);
        }
    });
}

export function useCreateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ clinicId, planId }) => createSubscription({ clinicId, planId }),
        onSuccess: (_, { clinicId }) => {
            toast.success("تم تفعيل الاشتراك الجديد");
            queryClient.invalidateQueries(["activeSubscription", clinicId]);
        },
        onError: (error) => {
            toast.error("فشل في تفعيل الاشتراك: " + error.message);
        }
    });
}