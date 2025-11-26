import { useQuery } from "@tanstack/react-query"
import { getRecentActivity } from "../../services/apiDashboard"

export default function useRecentActivity() {
    return useQuery({
        queryKey: ["recentActivity"],
        queryFn: getRecentActivity,
    })
}