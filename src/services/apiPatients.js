import supabase from "./supabase"

export async function getPatients(search, page, pageSize) {
  const from = Math.max(0, (page - 1) * pageSize)
  const to = from + pageSize - 1
  let query = supabase
    .from("patients")
    .select("id,name,phone,gender,address,date_of_birth,blood_type", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)
  if (search && search.trim()) {
    const s = `%${search.trim()}%`
    query = query.or(`name.ilike.${s},phone.ilike.${s}`)
  }
  const { data, error, count } = await query
  if (error) throw error
  return { items: data ?? [], total: count ?? 0 }
}

export async function createPatient(payload) {
  const { data, error } = await supabase
    .from("patients")
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getPatientById(id) {
  const { data, error } = await supabase
    .from("patients")
    .select("id,name,phone,gender,address,date_of_birth,blood_type")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function updatePatient(id, payload) {
  const { data, error } = await supabase
    .from("patients")
    .update(payload)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

