import { useQuery } from "@tanstack/react-query"
import { getPatients } from "../../services/apiPatients"
import { PAGE_SIZE } from "../../constants/pagination"

export default function usePatients(search, page = 1) {
  return useQuery({
    queryKey: ["patients", search ?? "", page],
    queryFn: () => getPatients(search, page, PAGE_SIZE)
  })
}
