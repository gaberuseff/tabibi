import { useQuery } from "@tanstack/react-query"
import { getCurrentPlan } from "../../services/apiPlan"

export default function usePlan() {
    return useQuery({
        queryKey: ["plan"],
        queryFn: getCurrentPlan,
        retry: false,
    })
}