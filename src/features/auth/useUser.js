import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../../services/apiAuth"

export default function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    })
}
