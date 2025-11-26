import { useQuery } from "@tanstack/react-query"
import { getCurrentClinic } from "../../services/apiClinic"

export default function useClinic() {
    return useQuery({
        queryKey: ["clinic"],
        queryFn: getCurrentClinic,
        retry: false,
    })
}
